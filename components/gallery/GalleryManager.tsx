import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type GalleryCategory = 'our_space' | 'before_after' | 'hair_creations' | 'nails_beauty' | 'team_moments';

interface GalleryItem {
  id: string;
  category: GalleryCategory;
  media_type: 'image' | 'video';
  media_url: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  tags?: string[];
  display_order: number;
}

const categoryLabels = {
  our_space: "Our Space",
  before_after: "Before & After",
  hair_creations: "Hair Creations",
  nails_beauty: "Nails & Beauty",
  team_moments: "Team Moments"
};

interface SortableItemProps {
  item: GalleryItem;
  onDelete: (id: string) => void;
}

const SortableItem = ({ item, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-card rounded-lg overflow-hidden border"
    >
      <div className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="bg-background/80 backdrop-blur-sm rounded p-1">
          <GripVertical className="h-5 w-5" />
        </div>
      </div>
      {item.media_type === 'image' ? (
        <img
          src={item.media_url}
          alt={item.title || ''}
          className="w-full h-48 object-cover"
        />
      ) : (
        <video
          src={item.media_url}
          className="w-full h-48 object-cover"
          controls
        />
      )}
      <Button
        size="icon"
        variant="destructive"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {item.title && (
        <p className="p-2 text-sm font-medium truncate bg-background/50 backdrop-blur-sm">{item.title}</p>
      )}
    </div>
  );
};

export const GalleryManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("our_space");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    media_url: "",
    before_image_url: "",
    after_image_url: ""
  });

  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      return publicUrl;
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const { error } = await supabase
        .from('gallery_items')
        .insert([newItem]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      toast.success("Gallery item added successfully!");
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add item: " + error.message);
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      toast.success("Item deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete item: " + error.message);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'media_url' | 'before_image_url' | 'after_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMutation.mutateAsync(file);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadMutation.mutateAsync(files[i]);
        const newItem: any = {
          category: selectedCategory,
          media_type: files[i].type.startsWith('video') ? 'video' : 'image',
          media_url: url,
          display_order: items.length + i,
        };
        await addItemMutation.mutateAsync(newItem);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} file(s)`);
    }
  };

  const handleSubmit = () => {
    const newItem: any = {
      category: selectedCategory,
      media_type: mediaType,
      media_url: formData.media_url,
      title: formData.title || null,
      description: formData.description || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
      display_order: items.length,
    };

    if (selectedCategory === 'before_after') {
      newItem.before_image_url = formData.before_image_url || null;
      newItem.after_image_url = formData.after_image_url || null;
    }

    addItemMutation.mutate(newItem);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: "",
      media_url: "",
      before_image_url: "",
      after_image_url: ""
    });
  };

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; display_order: number }[]) => {
      const promises = updates.map(({ id, display_order }) =>
        supabase
          .from('gallery_items')
          .update({ display_order })
          .eq('id', id)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      toast.success("Order updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update order: " + error.message);
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredItems.findIndex((item) => item.id === active.id);
      const newIndex = filteredItems.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(filteredItems, oldIndex, newIndex);
      const updates = newOrder.map((item, index) => ({
        id: item.id,
        display_order: index
      }));

      updateOrderMutation.mutate(updates);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Manager</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Gallery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as GalleryCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Media Type</Label>
                <Select value={mediaType} onValueChange={(v) => setMediaType(v as 'image' | 'video')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory === 'before_after' ? (
                <>
                  <div>
                    <Label>Before Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'before_image_url')}
                      disabled={uploading}
                    />
                    {formData.before_image_url && (
                      <img src={formData.before_image_url} alt="Before" className="mt-2 h-32 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <Label>After Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'after_image_url')}
                      disabled={uploading}
                    />
                    {formData.after_image_url && (
                      <img src={formData.after_image_url} alt="After" className="mt-2 h-32 object-cover rounded" />
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <Label>Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
                  <Input
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileUpload(e, 'media_url')}
                    disabled={uploading}
                  />
                  {formData.media_url && mediaType === 'image' && (
                    <img src={formData.media_url} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
              )}

              <div>
                <Label>Title (Optional)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                />
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>

              {selectedCategory === 'hair_creations' && (
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. Balayage, Highlights, Updos"
                  />
                </div>
              )}

              <Button onClick={handleSubmit} disabled={uploading || !formData.media_url} className="w-full">
                {uploading ? "Uploading..." : "Add to Gallery"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <Label>View Category</Label>
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as GalleryCategory)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="bulk-upload" className="cursor-pointer">
            <Button asChild variant="outline">
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </span>
            </Button>
          </Label>
          <Input
            id="bulk-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleBulkUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={(id) => deleteItemMutation.mutate(id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No items in this category yet. Click "Add Item" to get started.
        </div>
      )}
    </div>
  );
};
