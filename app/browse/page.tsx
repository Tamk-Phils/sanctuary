"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import Link from "next/link";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    status: string;
    puppy_images: string[];
}

export default function BrowsePage() {
    const [puppies, setPuppies] = useState<Puppy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPuppies = async () => {
            try {
                const { data, error } = await supabase
                    .from("puppies")
                    .select("*")
                    .eq("status", "available");

                if (error) {
                    throw error;
                }

                if (data) {
                    setPuppies(data as Puppy[]);
                }
            } catch (error) {
                console.error("Error fetching puppies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPuppies();

        // Set up realtime subscription
        const subscription = supabase
            .channel('public:puppies_browse')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'puppies',
            }, () => {
                fetchPuppies();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900 tracking-tight">Available Puppies</h1>
                <p className="mt-4 text-xl text-brown-800">
                    Meet our adorable Bichon Frise puppies looking for their forever homes.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
                </div>
            ) : puppies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {puppies.map((pup) => (
                        <Link key={pup.id} href={`/puppies/${pup.id}`} className="group block">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-cream-200">
                                <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                                    {pup.puppy_images && pup.puppy_images.length > 0 ? (
                                        <img
                                            src={pup.puppy_images[0]}
                                            alt={pup.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex justify-center items-center text-brown-800 opacity-50">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-brown-900 mb-2">{pup.name}</h3>
                                    <div className="flex justify-between text-brown-800 font-medium text-sm">
                                        <span>{pup.gender}</span>
                                        <span>{pup.age} old</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-2xl border border-cream-200 shadow-sm text-brown-800">
                    No puppies available at this moment. Please check back later!
                </div>
            )}
        </div>
    );
}
