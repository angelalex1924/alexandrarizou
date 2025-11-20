import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  is_active: boolean;
}

interface MultiServiceSelectorProps {
  selectedServices: string[];
  onServiceChange: (serviceIds: string[], totalDuration: number) => void;
}

export const MultiServiceSelector = ({ selectedServices, onServiceChange }: MultiServiceSelectorProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];

    const totalDuration = services
      .filter(s => newSelection.includes(s.id))
      .reduce((sum, s) => sum + s.duration_minutes, 0);

    onServiceChange(newSelection, totalDuration);
  };

  const getTotalPrice = () => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + (s.price || 0), 0);
  };

  const getTotalDuration = () => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.duration_minutes, 0);
  };

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Φόρτωση υπηρεσιών...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedServices.includes(service.id)
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleServiceToggle(service.id)}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedServices.includes(service.id)}
                onCheckedChange={(checked) => {
                  // Prevent event from bubbling to Card's onClick
                  if (checked !== selectedServices.includes(service.id)) {
                    handleServiceToggle(service.id);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{service.name}</h4>
                  {service.price && (
                    <Badge variant="secondary" className="ml-2">
                      <Euro className="h-3 w-3 mr-1" />
                      {service.price.toFixed(2)}
                    </Badge>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {service.duration_minutes} λεπτά
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary">
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center space-x-4">
              <div>
                <Clock className="h-4 w-4 inline mr-1" />
                Συνολική Διάρκεια: <strong>{getTotalDuration()} λεπτά</strong>
              </div>
              <div>
                <Euro className="h-4 w-4 inline mr-1" />
                Συνολικό Κόστος: <strong>€{getTotalPrice().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
