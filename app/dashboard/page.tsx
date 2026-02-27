"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/supabase/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function UserDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [requests, setRequests] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [reqRes, notifRes] = await Promise.all([
                    supabase.from("adoption_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
                    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
                ]);

                if (reqRes.data) setRequests(reqRes.data);
                if (notifRes.data) setNotifications(notifRes.data);

                // Mark unread notifications as read
                const unreadIds = notifRes.data?.filter(n => !n.read).map(n => n.id) || [];
                if (unreadIds.length > 0) {
                    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const notifSub = supabase.channel('public:notifications:' + user.id)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
            }).subscribe();

        const reqSub = supabase.channel('public:requests:' + user.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'adoption_requests', filter: `user_id=eq.${user.id}` }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setRequests(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setRequests(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
                }
            }).subscribe();

        return () => {
            supabase.removeChannel(notifSub);
            supabase.removeChannel(reqSub);
        };
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div></div>;
    }

    const hasApproved = requests.some(r => r.status === "approved");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-brown-900 mb-2">My Applications</h1>
                    <p className="text-brown-800">Track the status of your adoption requests.</p>
                </div>

                {hasApproved && (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h4 className="font-bold text-green-900 mb-2 text-lg">Action Required: Complete Your Deposit</h4>
                        <p className="text-green-800 text-sm">
                            Congratulations! One or more of your adoption applications have been approved.
                            <strong> Please contact support via live chat or at support@elliesanctuary.com to proceed with the payment of your refundable deposit</strong> and secure your puppy.
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-cream-200 text-center shadow-sm">
                            <FileText className="h-12 w-12 text-sand-300 mx-auto mb-3" />
                            <p className="text-brown-800 font-medium pb-4">You haven't submitted any adoption applications yet.</p>
                            <Link href="/browse" className="bg-sand-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-sand-500 transition-colors">
                                Browse Puppies
                            </Link>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-brown-900">Application for {req.puppy_name}</h3>
                                    <p className="text-sm text-brown-800 mt-1">Submitted on {new Date(req.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shrink-0 ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {req.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                                    {req.status === 'rejected' && <XCircle className="h-4 w-4" />}
                                    {req.status === 'pending' && <Clock className="h-4 w-4" />}
                                    {req.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream-200 sticky top-24">
                    <div className="flex items-center gap-2 border-b border-cream-200 pb-4 mb-4">
                        <Bell className="h-6 w-6 text-sand-600" />
                        <h2 className="text-xl font-bold text-brown-900">Notifications</h2>
                    </div>

                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-brown-800 text-center py-4">You have no new notifications.</p>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-4 rounded-2xl text-sm ${notif.read ? 'bg-cream-50 text-brown-800 border border-cream-100' : 'bg-sand-50 text-brown-900 border border-sand-200 font-medium'}`}>
                                    <p>{notif.message}</p>
                                    <p className="text-xs opacity-60 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-sand-600 p-6 rounded-3xl shadow-sm text-white sticky top-[30rem]">
                    <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                    <p className="text-sand-100 text-sm mb-4">Have questions about your application or a specific puppy?</p>
                    <Link href="/chat" className="block w-full bg-white text-sand-600 text-center font-bold py-3 rounded-xl hover:bg-sand-50 transition-colors shadow-sm">
                        Chat with Ellie
                    </Link>
                </div>
            </div>
        </div>
    );
}
