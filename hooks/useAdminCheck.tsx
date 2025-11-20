import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkedForUserId, setCheckedForUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      // Always start in loading state whenever the user changes
      setLoading(true);
      setCheckedForUserId(null);

      if (!user) {
        console.log("[useAdminCheck] No user, setting isAdmin to false");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log("[useAdminCheck] Checking admin role for user:", user.id);

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["admin", "owner"]);

        console.log("[useAdminCheck] Query result:", { rows: data?.length || 0, error });

        if (error) throw error;
        setIsAdmin(!!data && data.length > 0);
        console.log("[useAdminCheck] Setting isAdmin to:", !!data && data.length > 0);
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } finally {
        setCheckedForUserId(user?.id ?? null);
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading, checkedForUserId };
};
