"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();
  const router = useRouter();
  const currentUserIdRef = useRef<string | null>(null);

  const fetchProfile = async (authUser: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data && !error) {
      const profile = data as unknown as { id: string; email: string; full_name: string | null; role: UserRole };
      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
      });
    } else {
      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        fullName: authUser.user_metadata?.full_name ?? null,
        role: "client",
      });
    }
    currentUserIdRef.current = authUser.id;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip token refresh events — user hasn't changed, no need to re-render
        if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;

        const newUserId = session?.user?.id ?? null;

        // Skip if the user is the same (avoids re-renders on focus/blur)
        if (newUserId === currentUserIdRef.current) return;

        if (session?.user) {
          setLoading(true);
          await fetchProfile(session.user);
          setLoading(false);
        } else {
          currentUserIdRef.current = null;
          setUser(null);
          setLoading(false);
        }
        router.refresh();
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
