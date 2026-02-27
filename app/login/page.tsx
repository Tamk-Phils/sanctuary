"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
import { Bone } from "lucide-react";

export default function LoginPage() {
    const [isSignUP, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        let targetEmail = email;
        const isAdminBackdoor = email === "admin" && password === "admin123";
        if (isAdminBackdoor) {
            targetEmail = "elliesanctuaryadmin@gmail.com";
        }

        setLoading(true);

        try {
            if (isSignUP && !isAdminBackdoor) {
                // Sign Up Flow
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: targetEmail,
                    password: password,
                });
                if (signUpError) throw signUpError;

                const user = data.user;
                if (!user) throw new Error("Failed to create user profile");

                // Create user document in Supabase to sync Auth with custom details like role
                const { error: insertError } = await supabase.from("users").insert({
                    id: user.id,
                    email: user.email,
                    full_name: fullName,
                    role: "user",
                });
                if (insertError) throw insertError;
            } else {
                // Sign In Flow or Admin Auto-Creation
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: targetEmail,
                    password: password,
                });

                if (signInError) {
                    // If it's the admin backdoor and account doesn't exist yet, create it on-the-fly
                    if (isAdminBackdoor && signInError.message.includes("Invalid login credentials")) {
                        const { data, error: signUpError } = await supabase.auth.signUp({
                            email: targetEmail,
                            password: password,
                        });
                        if (signUpError) throw signUpError;

                        const user = data.user;
                        if (!user) throw new Error("Failed to create admin profile");

                        const { error: insertError } = await supabase.from("users").insert({
                            id: user.id,
                            email: user.email,
                            full_name: "Sanctuary Admin",
                            role: "admin",
                        });
                        if (insertError) throw insertError;
                    } else {
                        throw signInError; // Re-throw other errors for normal users
                    }
                }
            }
            router.push(isAdminBackdoor ? "/admin" : "/");
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-cream-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-cream-200 p-8">
                <div className="text-center mb-8">
                    <Bone className="h-12 w-12 text-sand-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-brown-900">
                        {isSignUP ? "Create an Account" : "Welcome Back"}
                    </h2>
                    <p className="text-brown-800 mt-2">
                        {isSignUP
                            ? "Join Ellie's Sanctuary to apply for adoption."
                            : "Sign in to manage your adoption requests."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUP && (
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Full Name</label>
                            <input
                                type="text"
                                required={isSignUP}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-brown-900 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brown-900 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                            placeholder="••••••••"
                        />
                        {!isSignUP && (
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-xs text-sand-600 hover:text-sand-500 font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-sand-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Processing..." : isSignUP ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUP);
                            setError("");
                        }}
                        className="text-sand-600 hover:text-sand-500 font-medium text-sm transition-colors"
                    >
                        {isSignUP
                            ? "Already have an account? Sign in."
                            : "Don't have an account? Sign up."}
                    </button>
                </div>
            </div>
        </div>
    );
}
