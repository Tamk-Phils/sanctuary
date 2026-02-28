"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/config";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    status: string;
    puppy_images: string[];
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function FeaturedPuppiesClient({ initialPuppies }: { initialPuppies: Puppy[] }) {
    const [puppies, setPuppies] = useState<Puppy[]>(initialPuppies);

    useEffect(() => {
        const subscription = supabase
            .channel('public:featured_puppies')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'puppies',
            }, async () => {
                const { data } = await supabase
                    .from("puppies")
                    .select("*")
                    .eq("status", "available")
                    .limit(3);
                if (data) setPuppies(data as Puppy[]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return (
        <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {puppies.map((pup) => (
                <motion.div variants={fadeIn} key={pup.id}>
                    <Link
                        href={`/puppies/${pup.id}`}
                        className="group block h-full"
                        aria-label={`View details for ${pup.name}`}
                    >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-cream-200 flex flex-col h-full transform group-hover:-translate-y-2">
                            <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brown-900 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm border border-cream-200">
                                    {pup.gender}
                                </div>
                                {pup.puppy_images && pup.puppy_images.length > 0 ? (
                                    <img
                                        src={pup.puppy_images[0]}
                                        alt={pup.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center text-brown-800 opacity-50 bg-cream-50">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <h3 className="text-3xl font-extrabold text-brown-900 mb-2">{pup.name}</h3>
                                <div className="flex items-center gap-2 text-brown-800 font-medium text-sm mb-6 border-b border-cream-100 pb-4">
                                    <span className="bg-cream-50 px-3 py-1 rounded-md border border-cream-200">{pup.age} old</span>
                                </div>
                                <div className="mt-auto">
                                    <span className="block w-full text-center bg-sand-600 text-white font-bold py-3 rounded-xl group-hover:bg-sand-500 transition-colors">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}

