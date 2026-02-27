"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/context";
import { usePathname } from "next/navigation";

export default function FloatingChatButton() {
    const { user, role } = useAuth();
    const pathname = usePathname();

    // Don't show on login, sign-up, or chat pages themselves
    const hideOn = ["/login", "/chat"];
    if (hideOn.includes(pathname) || !user) return null;

    // Different color for admin
    const bgColor = role === "admin" ? "bg-brown-900" : "bg-sand-600";
    const hoverColor = role === "admin" ? "bg-brown-800" : "bg-sand-500";
    const chatLink = role === "admin" ? "/admin/chat" : "/chat";

    return (
        <Link
            href={chatLink}
            className={`fixed bottom-8 right-8 ${bgColor} ${hoverColor} text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-40 group flex items-center gap-3`}
            aria-label="Live Chat"
        >
            <MessageCircle className="h-6 w-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
                {role === "admin" ? "Admin Chat" : "Talk to Ellie"}
            </span>
        </Link>
    );
}
