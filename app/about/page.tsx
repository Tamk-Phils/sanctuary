"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ShieldCheck, Home } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="pt-32 pb-24 bg-cream-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex p-3 rounded-2xl bg-sand-50 text-sand-600 mb-6 border border-sand-100">
                        <Heart className="h-6 w-6" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brown-900 mb-6 tracking-tight">
                        Our <span className="text-sand-600">Story</span>
                    </h1>
                    <p className="text-xl text-brown-800 max-w-2xl mx-auto leading-relaxed font-medium">
                        A lifelong passion for Bichon Frises turned into a sanctuary of love, excellence, and ethical breeding.
                    </p>
                </motion.div>

                {/* Sanctuary Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden mb-24 shadow-2xl border-8 border-white group"
                >
                    <img
                        src="/images/resources/about-sanctuary.png"
                        alt="Ellie's Bichon Sanctuary Garden"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent"></div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-extrabold text-brown-900 leading-tight">
                            Where Every Puppy Begins with <span className="text-sand-600">Love</span>
                        </h2>
                        <div className="space-y-6 text-lg text-brown-800 leading-relaxed font-medium opacity-90">
                            <p>
                                Welcome to Ellie's Bichon Frise Sanctuary. What started as a small, family-run effort to care for a single Bichon Frise has blossomed into a full sanctuary dedicated to this incredible breed.
                            </p>
                            <p>
                                We have spent years understanding their unique needs, temperaments, and personalities. Our mission is to provide families with more than just a pet, but a well-adjusted, healthy, and joyful new family member.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm">
                                <Sparkles className="h-8 w-8 text-sand-500 mb-4" />
                                <h4 className="font-bold text-brown-900 mb-2">Socialization</h4>
                                <p className="text-sm text-brown-700 font-medium">Raised inside our home with daily interaction.</p>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm">
                                <ShieldCheck className="h-8 w-8 text-sand-500 mb-4" />
                                <h4 className="font-bold text-brown-900 mb-2">Ethical Standards</h4>
                                <p className="text-sm text-brown-700 font-medium">Health testing and veterinary oversight for all parents.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                            <img
                                src="/images/hero-bg.png"
                                alt="Puppy Playtime"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sand-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl rotate-3">
                            <span className="text-5xl font-black">10+</span>
                            <span className="text-sm font-bold uppercase tracking-wider">Years Exp</span>
                        </div>
                    </motion.div>
                </div>

                {/* Meet the Parents Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-brown-900 rounded-[4rem] p-12 md:p-20 text-white overflow-hidden relative"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20">
                                <Home className="h-6 w-6 text-sand-400" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">
                                Meet the <span className="text-sand-400">Bloodline</span>
                            </h3>
                            <p className="text-xl text-cream-50 leading-relaxed font-medium opacity-90">
                                Superior puppies come from superior parents. We select only the most elegant, healthy, and gentle-natured Bichons for our breeding program.
                            </p>
                            <ul className="space-y-4 text-lg font-bold">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-sand-400 rounded-full" />
                                    AKC Registered Pedigrees
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-sand-400 rounded-full" />
                                    Regular Genetic Health Screening
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-sand-400 rounded-full" />
                                    Proven Temperament for Family Living
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl relative">
                                <img
                                    src="/images/resources/bichon-parents.png"
                                    alt="Elite Bichon Parents"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent flex items-end p-8">
                                    <div>
                                        <p className="text-sand-400 font-bold uppercase tracking-widest text-sm mb-1">Featured Duo</p>
                                        <h4 className="text-2xl font-black">King & Queen of the Sanctuary</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </motion.section>
            </div>
        </main>
    );
}
