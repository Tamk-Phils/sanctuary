"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Dog,
    ClipboardList,
    MessageCircle,
    Users,
    ChevronLeft,
    ChevronRight,
    Bone,
    Settings,
    LogOut,
    ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/config";

const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Puppies Inventory", href: "/admin/puppies", icon: Dog },
    { label: "Adoption Requests", href: "/admin/requests", icon: ClipboardList },
    { label: "Live Chats", href: "/admin/chat", icon: MessageCircle },
    { label: "Manage Users", href: "/admin/users", icon: Users },
];

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    userEmail?: string;
}

export default function AdminSidebar({ collapsed, setCollapsed, userEmail }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside
            className={`flex flex-col bg-brown-900 text-white transition-all duration-300 shadow-2xl z-40 ${collapsed ? "w-20" : "w-64"
                } ${isMobile ? "fixed inset-y-0 left-0 translate-x-0" : "sticky top-0 h-screen"}`}
        >
            {/* Logo Area */}
            <div className={`flex items-center gap-3 p-6 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
                <div className="bg-sand-400 p-2 rounded-xl">
                    <Bone className="h-5 w-5 text-brown-900" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="font-extrabold tracking-tight leading-none">ADMIN</span>
                        <span className="text-[10px] font-bold text-sand-400 tracking-wider">PORTAL</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${active
                                    ? "bg-sand-400 text-brown-900"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                } ${collapsed ? "justify-center" : ""}`}
                            title={collapsed ? item.label : ""}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${active ? "animate-pulse" : ""}`} />
                            {!collapsed && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
                            {!collapsed && active && (
                                <div className="ml-auto w-1.5 h-1.5 bg-brown-900 rounded-full" />
                            )}
                        </Link>
                    );
                })}

                <div className="pt-6 mt-6 border-t border-white/10">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all ${collapsed ? "justify-center" : ""}`}
                    >
                        <ExternalLink className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="font-bold text-sm tracking-wide">Public Site</span>}
                    </Link>
                </div>
            </nav>

            {/* Toggle Button (Desktop Only) */}
            {!isMobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 bg-sand-400 text-brown-900 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            )}

            {/* User Profile Area */}
            <div className={`p-4 border-t border-white/10 bg-black/20 ${collapsed ? "items-center" : ""}`}>
                {!collapsed && (
                    <div className="flex flex-col mb-4">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Authenticated</span>
                        <span className="text-xs font-bold truncate text-sand-200">{userEmail}</span>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? "Logout" : ""}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="font-bold text-xs uppercase tracking-wider">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
