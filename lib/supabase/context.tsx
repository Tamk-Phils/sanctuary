"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, supabaseIsConfigured } from "./config";
import { registerServiceWorker, subscribeUserToPush } from "./push";

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
                // Try to get cached role first to eliminate flash
                const cachedRole = typeof window !== 'undefined' ? sessionStorage.getItem('user-role') : null;
                if (cachedRole) {
                    setRole(cachedRole as "user" | "admin");
                }

                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    const { data } = await supabase
                        .from("users")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    const newRole = (data?.role as "user" | "admin") || "user";
                    setRole(newRole);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('user-role', newRole);
                        // Register SW and attempt push subscription
                        registerServiceWorker().then(() => {
                            if (session.user) subscribeUserToPush(session.user.id);
                        });
                    }
                } else {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('user-role');
                    }
                }
            } catch (error) {
                console.error("Error initially confirming session", error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    const { data } = await supabase
                        .from("users")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    const newRole = (data?.role as "user" | "admin") || "user";
                    setRole(newRole);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('user-role', newRole);
                        // Register SW and attempt push subscription
                        registerServiceWorker().then(() => {
                            if (session.user) subscribeUserToPush(session.user.id);
                        });
                    }
                } else {
                    setUser(null);
                    setRole(null);
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('user-role');
                    }
                }
                setLoading(false);
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
