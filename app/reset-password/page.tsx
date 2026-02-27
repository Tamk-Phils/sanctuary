"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
import { Bone } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Listening for the PASSWORD_RECOVERY event to ensure the user clicked the link
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                console.log("Password recovery mode active.");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            setMessage("Password successfully updated! Redirecting to dashboard...");

            // Redirect after brief pause
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to update password. Your link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-cream-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-cream-200 p-8">
                <div className="text-center mb-8">
                    <Bone className="h-12 w-12 text-sand-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-brown-900">Set New Password</h2>
                    <p className="text-brown-800 mt-2">
                        Please enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200 text-center font-medium">
                        {message}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="w-full bg-sand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-sand-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
