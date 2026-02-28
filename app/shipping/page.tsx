"use client";

import { motion } from "framer-motion";
import { Plane, Truck, MapPin, CheckCircle2 } from "lucide-react";

export default function ShippingPage() {
    return (
        <main className="pt-32 pb-24 bg-cream-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brown-900 mb-6 tracking-tight font-display">
                        Shipping & <span className="text-sand-600">Delivery</span>
                    </h1>
                    <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed font-medium">
                        Whether you're local or across the country, we ensure your new Bichon puppy arrives safely, comfortably, and on time.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden mb-20 shadow-2xl border-8 border-white group"
                >
                    <img
                        src="/images/resources/shipping.png"
                        alt="Pet transport experience"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent flex items-end p-12">
                        <div className="text-white">
                            <h2 className="text-3xl font-bold mb-2">Safe & Sound Arrival</h2>
                            <p className="text-lg opacity-90 font-medium">Your new family member's journey is monitored every step of the way.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Air Transport */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-cream-200 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-sand-50 rounded-3xl flex items-center justify-center text-sand-600 mb-8 border border-sand-100">
                            <Plane className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-brown-900 mb-4">Flight Nanny</h3>
                        <p className="text-brown-800 font-medium opacity-80 mb-8">A personal escort who keeps your puppy in the cabin under their seat for constant care and monitoring.</p>
                        <div className="mt-auto pt-6 border-t border-cream-100 w-full font-extrabold text-sand-600 text-lg">
                            $450 - $650
                        </div>
                    </div>

                    {/* Ground Transport */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-cream-200 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-sand-50 rounded-3xl flex items-center justify-center text-sand-600 mb-8 border border-sand-100">
                            <Truck className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-brown-900 mb-4">Ground Transport</h3>
                        <p className="text-brown-800 font-medium opacity-80 mb-8">Professional USDA-certified pet transporters deliver directly to your doorstep in climate-controlled vehicles.</p>
                        <div className="mt-auto pt-6 border-t border-cream-100 w-full font-extrabold text-sand-600 text-lg">
                            $300 - $550
                        </div>
                    </div>

                    {/* Local Pickup */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-cream-200 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-sand-50 rounded-3xl flex items-center justify-center text-sand-600 mb-8 border border-sand-100">
                            <MapPin className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-brown-900 mb-4">Local Pickup</h3>
                        <p className="text-brown-800 font-medium opacity-80 mb-8">Visit our sanctuary, meet the parents, and pick up your new family member in person at no extra cost.</p>
                        <div className="mt-auto pt-6 border-t border-cream-100 w-full font-extrabold text-sand-600 text-lg">
                            FREE
                        </div>
                    </div>
                </div>

                <div className="bg-brown-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Safety First, <br />Every Mile.</h2>
                            <p className="text-xl text-cream-50/80 font-medium leading-relaxed">
                                We've successfully delivered over 500 puppies to families worldwide. Our logistics team handles every detail, from health certificates to flight bookings.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "USDA Inspected Carriers",
                                    "Climate Controlled Environments",
                                    "Regular Potty & Water Breaks",
                                    "Daily Photo/Video Updates",
                                    "Fully Insured Transit"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-sand-400" />
                                        <span className="text-lg font-bold">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-3xl aspect-square w-full backdrop-blur-3xl border border-white/10 p-12 flex flex-col justify-center">
                            <h4 className="text-3xl font-extrabold mb-4">Booking Policy</h4>
                            <p className="text-cream-50 font-medium text-lg mb-8 leading-relaxed">
                                Shipping costs are paid directly to the carrier. We recommend booking at least 10 days before your puppy's "Release Date" to ensure availability.
                            </p>
                            <button className="bg-sand-600 text-white font-bold py-5 rounded-2xl hover:bg-sand-500 transition-colors shadow-2xl">
                                Check Next Availability
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
