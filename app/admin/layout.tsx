"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Bell, Dog } from "lucide-react";
import { useAuth } from "@/lib/supabase/context";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (role !== "admin") {
                router.push("/");
            }
        }
    }, [user, role, loading, router]);

    if (loading || role !== "admin") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-cream-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-cream-50 font-sans text-brown-900">
            {/* Sidebar Component */}
            <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    userEmail={user?.email || "Admin User"}
                />
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar for Header/Mobile Toggle */}
                <header className="h-20 bg-white border-b border-cream-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-brown-900 bg-cream-100 rounded-xl"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                                <Dog className="h-5 w-5 text-sand-500" />
                                Sanctuary Command
                            </h2>
                            <p className="text-[10px] font-bold text-brown-400 tracking-widest uppercase">Admin Management Panel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-brown-400 hover:text-sand-600 transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-10 h-10 bg-sand-400 rounded-2xl flex items-center justify-center font-bold text-brown-900 shadow-lg shadow-sand-400/20">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

