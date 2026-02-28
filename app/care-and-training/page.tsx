"use client";

import { motion } from "framer-motion";
import { Scissors, Bone, BookOpen, Sun } from "lucide-react";

export default function CareTrainingPage() {
    return (
        <main className="pt-32 pb-24 bg-cream-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brown-900 mb-6 tracking-tight">
                        Care & <span className="text-sand-600">Training</span>
                    </h1>
                    <p className="text-xl text-brown-800 max-w-2xl mx-auto leading-relaxed font-medium">
                        Everything you need to know about raising a healthy, happy, and well-behaved Bichon Frise.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {/* Grooming */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-cream-200 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex p-4 rounded-2xl bg-sand-50 text-sand-600 border border-sand-100">
                                <Scissors className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brown-900">Premium Grooming</h2>
                            <p className="text-lg text-brown-800 leading-relaxed font-medium opacity-90">
                                The Bichon's iconic white coat is hypoallergenic but requires regular maintenance. We recommend professional grooming every 4-6 weeks and daily brushing to prevent matting.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-brown-900 font-bold">
                                <li className="flex items-center gap-2">✓ Daily Brushing</li>
                                <li className="flex items-center gap-2">✓ Tear Stain Care</li>
                                <li className="flex items-center gap-2">✓ Monthly Nail Trims</li>
                                <li className="flex items-center gap-2">✓ Regular Ear Cleaning</li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-cream-100 rounded-3xl aspect-[4/3] w-full overflow-hidden border-4 border-white shadow-xl">
                            <img
                                src="/images/resources/care-and-training.png"
                                alt="Bichon Frise being groomed"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </section>

                    {/* Nutrition */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-cream-200 flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex p-4 rounded-2xl bg-sand-50 text-sand-600 border border-sand-100">
                                <Bone className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-brown-900">Holistic Nutrition</h2>
                            <p className="text-lg text-brown-800 leading-relaxed font-medium opacity-90">
                                Bichons can have sensitive stomachs. We recommend a high-quality, grain-free kibble or a vet-approved raw diet formulated specifically for small breeds.
                            </p>
                            <div className="p-6 bg-cream-50 rounded-2xl border border-cream-200">
                                <h4 className="font-extrabold text-brown-900 mb-2">Pro Tip:</h4>
                                <p className="text-brown-800 text-sm font-medium">Always use local spring water or filtered water to help prevent brown tear staining around their eyes!</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-cream-100 rounded-3xl aspect-[4/3] w-full overflow-hidden border-4 border-white shadow-xl">
                            <img
                                src="/images/resources/training-treat.png"
                                alt="Bichon Frise puppy being trained"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </section>

                    {/* Training */}
                    <section className="bg-sand-600 text-white rounded-[3rem] p-8 md:p-16 shadow-2xl">
                        <div className="max-w-3xl space-y-8">
                            <div className="inline-flex p-4 rounded-2xl bg-white/10 text-white border border-white/20">
                                <BookOpen className="h-10 w-10" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold">Training & Socialization</h2>
                            <p className="text-xl text-cream-50 leading-relaxed font-medium">
                                Bichons are highly intelligent but can be stubborn. Positive reinforcement and early socialization are the keys to a confident, friendly adult dog.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                <div>
                                    <h4 className="font-extrabold mb-3 text-2xl">Potty Training</h4>
                                    <p className="text-cream-50 font-medium">Bichons require consistency. Crate training is highly effective for this breed during puppyhood.</p>
                                </div>
                                <div>
                                    <h4 className="font-extrabold mb-3 text-2xl">Socialization</h4>
                                    <p className="text-cream-50 font-medium">Introduce your puppy to new sights, sounds, and people daily until 16 weeks of age.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
