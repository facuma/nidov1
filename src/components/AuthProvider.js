"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hostMode, setHostMode] = useState(false);

  useEffect(() => {
    // Carga el perfil del usuario (incluye is_owner)
    const loadUserProfile = async (session) => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("users")
          .select("is_owner")
          .eq("id", session.user.id)
          .single();
        setUser({
          ...session.user,
          is_owner: profile?.is_owner ?? false,
        });
      } else {
        setUser(null);
      }
    };

    // Obtiene la sesión inicial
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      await loadUserProfile(session);
      setLoading(false);
    };

    // Escucha cambios de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        await loadUserProfile(session);
      }
    );

    getSession();

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, hostMode, setHostMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}
