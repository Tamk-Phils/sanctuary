"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { Dog, Users, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ puppies: 0, requested: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch puppies count
                const { count: pupsCount, error: pupsError } = await supabase
                    .from("puppies")
                    .select("*", { count: "exact", head: true });

                // Fetch pending requests count
                const { count: reqsCount, error: reqsError } = await supabase
                    .from("adoption_requests")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "pending");

                // Fetch users count
                const { count: usersCount, error: usersError } = await supabase
                    .from("users")
                    .select("*", { count: "exact", head: true });

                if (pupsError || reqsError || usersError) {
                    throw new Error("Failed to load statistics");
                }

                setStats({
                    puppies: pupsCount || 0,
                    requested: reqsCount || 0,
                    users: usersCount || 0
                });
            } catch (error) {
                console.error("Failed to load stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="animate-pulse flex space-x-4 p-8 bg-white rounded-3xl border border-cream-200"><div className="h-64 bg-cream-100 rounded-2xl w-full"></div></div>;
    }

    const cards = [
        { title: "Total Puppies", value: stats.puppies, icon: <Dog className="h-8 w-8 text-sand-600" /> },
        { title: "Pending Requests", value: stats.requested, icon: <ClipboardList className="h-8 w-8 text-sand-600" /> },
        { title: "Registered Users", value: stats.users, icon: <Users className="h-8 w-8 text-sand-600" /> },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-brown-900">Dashboard Overview</h1>
                <p className="text-brown-800 mt-2">Welcome back, Ellie. Here is what is happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((val, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200 flex items-center gap-6">
                        <div className="bg-cream-100 p-4 rounded-2xl">
                            {val.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brown-800 uppercase tracking-widest mb-1">{val.title}</p>
                            <h2 className="text-4xl font-extrabold text-brown-900">{val.value}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
