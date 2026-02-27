"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { Bone } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                // redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setMessage("A password reset link has been sent to your email address. Please check your inbox (and spam folder).");
        } catch (err: any) {
            // Note: Supabase sometimes returns success even for unregistered emails for security reasons
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-cream-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-cream-200 p-8">
                <div className="text-center mb-8">
                    <Bone className="h-12 w-12 text-sand-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-brown-900">Forgot Password</h2>
                    <p className="text-brown-800 mt-2">
                        Enter your email address and we'll send you a secure link to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {message ? (
                    <div className="text-center space-y-6">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200">
                            {message}
                        </div>
                        <Link href="/login" className="inline-block w-full bg-sand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-sand-500 transition-colors">
                            Return to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full bg-sand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-sand-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-sand-600 hover:text-sand-500 font-medium text-sm transition-colors">
                                &larr; Back to sign in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
