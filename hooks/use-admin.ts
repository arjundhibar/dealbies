"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const useAdmin = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        if (response.ok) {
          const { role } = await response.json();
          setIsAdmin(role === "ADMIN");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, session]);

  return { isAdmin, loading };
};
