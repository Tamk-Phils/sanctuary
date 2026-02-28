"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Stethoscope, Award } from "lucide-react";

export default function HealthGuaranteePage() {
    return (
        <main className="pt-32 pb-24 bg-cream-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-brown-900 mb-6 font-display tracking-tight">
                        Our Health <span className="text-sand-600">Guarantee</span>
                    </h1>
                    <p className="text-xl text-brown-800 max-w-2xl mx-auto leading-relaxed font-medium">
                        At Ellie's Bichon Frise Sanctuary, we stand behind the health and happiness of every puppy we raise.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden mb-16 shadow-2xl border-8 border-white"
                >
                    <img
                        src="/images/resources/health-guarantee.png"
                        alt="Healthy Bichon Frise puppy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                        {
                            icon: <ShieldCheck className="h-8 w-8 text-sand-600" />,
                            title: "1-Year Health Guarantee",
                            desc: "We guarantee your puppy against life-threatening congenital or hereditary defects for one full year."
                        },
                        {
                            icon: <Stethoscope className="h-8 w-8 text-sand-600" />,
                            title: "Vet Certified",
                            desc: "Every puppy undergoes a complete head-to-tail examination by a licensed veterinarian before going home."
                        },
                        {
                            icon: <Heart className="h-8 w-8 text-sand-600" />,
                            title: "Up-to-Date Vaccines",
                            desc: "Puppies come with documented age-appropriate vaccinations and deworming treatments."
                        },
                        {
                            icon: <Award className="h-8 w-8 text-sand-600" />,
                            title: "Lifetime Support",
                            desc: "Our relationship doesn't end when you take your puppy home. We're here for any questions, forever."
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-2xl font-bold text-brown-900 mb-3">{item.title}</h3>
                            <p className="text-brown-800 leading-relaxed font-medium opacity-80">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-sand-600 text-white p-10 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Breeder Responsibilities</h2>
                        <ul className="space-y-4 text-cream-50 font-medium">
                            <li className="flex items-start gap-3">
                                <span className="bg-white/20 p-1 rounded-full mt-1">
                                    <ShieldCheck className="h-4 w-4" />
                                </span>
                                Provide a healthy, socialized puppy from quality AKC/CKC bloodlines.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-white/20 p-1 rounded-full mt-1">
                                    <ShieldCheck className="h-4 w-4" />
                                </span>
                                Disclose all known health history and provide official vet documentation.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-white/20 p-1 rounded-full mt-1">
                                    <ShieldCheck className="h-4 w-4" />
                                </span>
                                Offer a partial refund or replacement puppy if a congenital defect is found within the first year.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
