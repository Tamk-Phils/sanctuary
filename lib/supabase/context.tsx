"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, supabaseIsConfigured } from "./config";

interface AuthContextType {
    user: User | null;
    role: "user" | "admin" | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"user" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabaseIsConfigured) {
            setLoading(false);
            return;
        }

        // Initial session fetch
        const initializeAuth = async () => {
            try {
                // Wipe any old local storage sessions to ensure strict per-tab isolation
                if (typeof window !== 'undefined') {
                    Object.keys(window.localStorage).forEach(key => {
                        if (key.includes('-auth-token') || key.startsWith('sb-')) {
                            window.localStorage.removeItem(key);
                        }
                    });
                }

                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    // Fetch role from profiles table
                    const { data, error } = await supabase
                        .from("users")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    if (data && !error) {
                        setRole(data.role as "user" | "admin");
                    } else {
                        setRole("user"); // Default fallback
                    }
                } else {
                    setUser(null);
                    setRole(null);
                }
            } catch (error) {
                console.error("Error initially confirming session", error);
                setRole(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                try {
                    setLoading(true);
                    if (session?.user) {
                        setUser(session.user);
                        const { data } = await supabase
                            .from("users")
                            .select("role")
                            .eq("id", session.user.id)
                            .single();
                        setRole((data?.role as "user" | "admin") || "user");
                    } else {
                        setUser(null);
                        setRole(null);
                    }
                } catch (error) {
                    console.error("Auth state change error:", error);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
