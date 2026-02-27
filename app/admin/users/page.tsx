"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/supabase/context";
import { Shield, ShieldAlert, User, Mail, Calendar, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
    const { user, role } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const deleteUser = async (userId: string, userEmail: string) => {
        if (userId === user?.id) {
            alert("You cannot delete your own account.");
            return;
        }

        if (!confirm(`Are you sure you want to delete user ${userEmail}? This will also delete all their adoption requests and chat history.`)) return;

        try {
            const { error } = await supabase
                .from("users")
                .delete()
                .eq("id", userId);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    useEffect(() => {
        if (role !== "admin") return;

        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                if (data) setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [role]);

    const toggleRole = async (userId: string, currentRole: string) => {
        // Prevent removing your own admin access accidentally
        if (userId === user?.id && currentRole === "admin") {
            alert("You cannot remove your own admin access.");
            return;
        }

        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            const { error } = await supabase
                .from("users")
                .update({ role: newRole })
                .eq("id", userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role.");
        }
    };

    if (loading) return <div className="animate-pulse bg-white p-8 rounded-3xl border border-cream-200 h-64"></div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-brown-900">User Management</h1>
                    <p className="text-brown-800 text-sm mt-1">Manage registered accounts and roles</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-cream-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-cream-100 border-b border-cream-200 text-brown-900 text-sm">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Email</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold">Joined</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-cream-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-brown-900 font-bold">
                                                <User className="w-5 h-5 text-sand-600" />
                                            </div>
                                            <span className="font-bold text-brown-900">{u.full_name || 'No Name'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-brown-800">
                                            <Mail className="w-4 h-4 text-sand-400" />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {u.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-brown-800">
                                            <Calendar className="w-4 h-4 text-sand-400" />
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleRole(u.id, u.role)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${u.role === 'admin'
                                                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                                    : 'bg-sand-50 text-sand-600 border-sand-200 hover:bg-sand-100'
                                                    }`}
                                            >
                                                {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(u.id, u.email)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-12 text-center text-brown-800">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
