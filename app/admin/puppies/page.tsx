"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import Link from "next/link";
import { CopyPlus, Edit2, Trash2 } from "lucide-react";

export default function AdminPuppiesList() {
    const [puppies, setPuppies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPuppies = async () => {
            try {
                const { data, error } = await supabase.from("puppies").select("*");
                if (error) throw error;
                if (data) setPuppies(data);
            } catch (error) {
                console.error("Error fetching puppies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPuppies();

        const subscription = supabase
            .channel('public:puppies_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'puppies' }, () => {
                fetchPuppies();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        }
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                const { error } = await supabase.from("puppies").delete().eq("id", id);
                if (error) throw error;
            } catch (error) {
                console.error("Error deleting puppy:", error);
                alert("Failed to delete puppy.");
            }
        }
    };

    if (loading) return <div className="animate-pulse bg-white p-8 rounded-3xl border border-cream-200 h-64"></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-cream-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-brown-900">Inventory Management</h1>
                    <p className="text-brown-800 text-sm mt-1">Manage all puppies in the sanctuary</p>
                </div>
                <Link href="/admin/puppies/new" className="bg-sand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-sand-500 transition-colors shadow-sm text-sm">
                    <CopyPlus className="h-4 w-4" /> Add Puppy
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-cream-200 overflow-hidden">
                <ul className="divide-y divide-cream-200">
                    {puppies.map(pup => (
                        <li key={pup.id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-cream-50 transition-colors">
                            <div className="w-20 h-20 rounded-2xl bg-cream-100 overflow-hidden flex-shrink-0 border border-cream-200">
                                {pup.puppy_images?.[0] ? (
                                    <img src={pup.puppy_images[0]} alt={pup.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brown-800 text-xs font-bold opacity-50">No Img</div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-brown-900">{pup.name}</h3>
                                <div className="text-brown-800 text-sm mt-1 flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-start">
                                    <span><strong className="text-brown-900">Age:</strong> {pup.age}</span>
                                    <span><strong className="text-brown-900">Gender:</strong> {pup.gender}</span>
                                    <span><strong className="text-brown-900">Fee:</strong> ${pup.adoption_fee}</span>
                                    <span><strong className="text-brown-900">Status:</strong> {pup.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/admin/puppies/edit/${pup.id}`} className="bg-cream-200 p-2.5 rounded-xl text-brown-900 hover:bg-cream-100 transition-colors">
                                    <Edit2 className="h-5 w-5" />
                                </Link>
                                <button onClick={() => handleDelete(pup.id, pup.name)} className="bg-red-50 p-2.5 rounded-xl text-red-600 hover:bg-red-100 transition-colors">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                    {puppies.length === 0 && (
                        <li className="p-12 text-center text-brown-800">
                            No puppies found in inventory.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
