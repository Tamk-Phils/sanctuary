"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/context";
import { Bone, Menu, X, Home, Dog, Info, HelpCircle, MessageCircle, LayoutDashboard, LogOut, User, Heart, Sparkles, Mail, ChevronDown, ShieldCheck, Scissors, Plane } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/config";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, role } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Browse", href: "/browse", icon: Dog },
        { name: "About", href: "/about", icon: Info },
        { name: "How It Works", href: "/how-it-works", icon: Sparkles },
        { name: "FAQ", href: "/faq", icon: HelpCircle },
        { name: "Contact", href: "/contact", icon: Mail },
    ];

    const resourceLinks = [
        { name: "Health Guarantee", href: "/health-guarantee", icon: ShieldCheck },
        { name: "Care & Training", href: "/care-and-training", icon: Scissors },
        { name: "Shipping", href: "/shipping", icon: Plane },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-md py-2" : "bg-transparent py-4"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand/Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative h-12 w-12 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sand-600/20">
                                <img
                                    src="/images/logo.png"
                                    alt="Ellie's Sanctuary Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? "text-brown-900" : "text-brown-900"
                                    }`}>
                                    ELLIE'S
                                </span>
                                <span className="text-[10px] font-bold text-sand-600 tracking-[0.2em] -mt-1 uppercase">
                                    Sanctuary
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${isActive(link.href)
                                        ? "text-sand-600 bg-sand-50"
                                        : "text-brown-800 hover:text-sand-600 hover:bg-cream-50"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive(link.href) ? "text-sand-600" : "text-brown-400 group-hover:text-sand-600"}`} />
                                    {link.name}
                                    {isActive(link.href) && (
                                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sand-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Resources Dropdown */}
                        <div className="relative group px-1">
                            <button className="px-4 py-2 rounded-xl text-sm font-bold text-brown-800 hover:text-sand-600 hover:bg-cream-50 flex items-center gap-2 transition-all duration-300">
                                <Sparkles className="h-4 w-4 text-brown-400 group-hover:text-sand-600" />
                                Resources
                                <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />
                            </button>
                            <div className="absolute top-full left-0 w-64 mt-2 bg-white rounded-2xl shadow-2xl border border-cream-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-2">
                                {resourceLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50 text-brown-800 hover:text-sand-600 transition-colors group/item"
                                        >
                                            <div className="p-2 rounded-lg bg-cream-50 group-hover/item:bg-white">
                                                <Icon className="h-4 w-4 text-brown-400" />
                                            </div>
                                            <span className="text-sm font-bold">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/chat"
                                    className="p-2 text-brown-800 hover:text-sand-600 hover:bg-sand-50 rounded-xl transition-all relative group"
                                    title="Live Chat"
                                    aria-label="Open live chat"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-sand-500 rounded-full border-2 border-white" />
                                </Link>

                                <Link
                                    href="/dashboard"
                                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isActive("/dashboard") ? "bg-brown-900 text-white shadow-lg shadow-brown-900/20" : "text-brown-900 bg-cream-100 hover:bg-cream-200"
                                        }`}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>

                                {role === "admin" && (
                                    <Link
                                        href="/admin"
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-white transition-all"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-brown-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                    aria-label="Log out of your account"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-8 py-2.5 rounded-2xl text-sm font-bold text-white bg-sand-600 hover:bg-sand-500 transition-all shadow-lg shadow-sand-600/30 flex items-center gap-2"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        {user && (
                            <Link href="/chat" className="p-2 text-brown-800 relative">
                                <MessageCircle className="h-6 w-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-sand-500 rounded-full" />
                            </Link>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-brown-900 bg-cream-100 rounded-xl hover:bg-cream-200 transition-all"
                            aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="bg-white border-t border-cream-200 px-4 py-6 space-y-4 shadow-2xl">
                    <div className="grid grid-cols-2 gap-3">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-cream-50 text-brown-900 font-bold hover:bg-sand-50 hover:text-sand-600 transition-all"
                                >
                                    <Icon className="h-5 w-5 opacity-60" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-cream-200">
                        <p className="px-4 text-[10px] font-bold text-brown-400 uppercase tracking-widest mb-3">Resources</p>
                        <div className="grid grid-cols-1 gap-2">
                            {resourceLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-cream-100 text-brown-900 font-bold hover:bg-sand-50 transition-all"
                                    >
                                        <Icon className="h-5 w-5 text-sand-500" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-cream-200 space-y-3">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-brown-900 text-white font-bold"
                                >
                                    <span className="flex items-center gap-3">
                                        <LayoutDashboard className="h-5 w-5" />
                                        My Dashboard
                                    </span>
                                    <Sparkles className="h-4 w-4 opacity-60" />
                                </Link>
                                {role === "admin" && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-brown-900 text-brown-900 font-bold"
                                    >
                                        Admin Portal
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center p-4 rounded-2xl bg-sand-600 text-white font-bold shadow-lg shadow-sand-600/30"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
