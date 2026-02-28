"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface Puppy {
    id: string;
    name: string;
    age: string;
    gender: string;
    status: string;
    adoption_fee: number;
    deposit_amount: number;
    puppy_images: string[];
    description?: string;
}

export default function PuppyDetailsClient({ puppy }: { puppy: Puppy }) {
    const [mainImg, setMainImg] = useState(puppy.puppy_images && puppy.puppy_images.length > 0 ? puppy.puppy_images[0] : "");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
                <div className="aspect-[4/3] bg-cream-100 rounded-2xl overflow-hidden border border-cream-200 relative">
                    {mainImg ? (
                        <Image
                            src={mainImg}
                            alt={puppy.name}
                            fill
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center text-brown-800 opacity-50">No Image Available</div>
                    )}
                </div>
                {puppy.puppy_images && puppy.puppy_images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {puppy.puppy_images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImg(img)}
                                aria-label={`View puppy image ${idx + 1}`}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors relative ${mainImg === img ? 'border-sand-600' : 'border-transparent hover:border-cream-200'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`${puppy.name} thumbnail ${idx}`}
                                    fill
                                    sizes="100px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-cream-200">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900">{puppy.name}</h1>
                    <div className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider ${puppy.status === 'available' ? 'bg-cream-100 text-brown-900' : 'bg-brown-900 text-white'}`}>
                        {puppy.status}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 mt-8">
                    <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                        <span className="block text-xs md:text-sm text-brown-800 uppercase tracking-wider font-semibold mb-1">Age</span>
                        <span className="text-lg md:text-xl font-bold text-brown-900">{puppy.age}</span>
                    </div>
                    <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                        <span className="block text-xs md:text-sm text-brown-800 uppercase tracking-wider font-semibold mb-1">Gender</span>
                        <span className="text-lg md:text-xl font-bold text-brown-900">{puppy.gender}</span>
                    </div>
                    <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                        <span className="block text-xs md:text-sm text-brown-800 uppercase tracking-wider font-semibold mb-1">Adoption Fee</span>
                        <span className="text-lg md:text-xl font-bold text-brown-900">${puppy.adoption_fee}</span>
                    </div>
                    <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                        <span className="block text-xs md:text-sm text-brown-800 uppercase tracking-wider font-semibold mb-1">Deposit</span>
                        <span className="text-lg md:text-xl font-bold text-brown-900">${puppy.deposit_amount}</span>
                    </div>
                </div>

                {puppy.description && (
                    <div className="mt-8 border-t border-cream-200 pt-8">
                        <h2 className="text-sm font-extrabold text-brown-900/40 uppercase tracking-widest mb-3">About this Puppy</h2>
                        <div className="text-brown-800 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                            {puppy.description}
                        </div>
                    </div>
                )}

                <div className="border-t border-cream-200 pt-8 mt-8 space-y-4">
                    {puppy.status === "available" ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={`/checkout/deposit/${puppy.id}`}
                                aria-label={`Start adoption process for ${puppy.name}`}
                                className="flex-1 bg-sand-600 text-white text-center px-8 py-4 rounded-full font-bold text-lg hover:bg-sand-500 transition shadow-md"
                            >
                                Adopt {puppy.name}
                            </Link>
                            <Link
                                href={`/chat?about=${puppy.id}`}
                                aria-label={`Ask a question about ${puppy.name}`}
                                className="flex-1 bg-white text-brown-900 border-2 border-cream-200 text-center px-8 py-4 rounded-full font-bold text-lg hover:border-sand-600 transition shadow-sm"
                            >
                                Ask a Question
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-cream-100 text-brown-800 text-center p-4 rounded-xl font-medium">
                            Sorry, {puppy.name} is currently {puppy.status}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
