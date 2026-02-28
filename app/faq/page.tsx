"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "Do you ship internationally?",
        a: "Yes! Currently, we offer specialized ground and flight nanny transportation across the USA, Canada, and Australia to ensure your puppy arrives safely."
    },
    {
        q: "Are the puppies vaccinated?",
        a: "Absolutely. All puppies receive their first round of shots, multiple rounds of dewormings, and a comprehensive vet check before leaving our sanctuary."
    },
    {
        q: "What is your health guarantee?",
        a: "We provide a comprehensive 1-year genetic health guarantee. Every puppy undergoes a final nose-to-tail examination by our veterinarian before adoption."
    },
    {
        q: "Can I choose my puppy's name?",
        a: "Yes! While we give them temporary names for identification, you are welcome to pick their forever name once your adoption request is approved."
    },
    {
        q: "What is your refund policy?",
        a: "Deposits are generally non-refundable. However, if a puppy fails its final vet check, you will receive a full refund or the option to apply it to a future litter."
    },
    {
        q: "Are Bichons hypoallergenic?",
        a: "Yes, Bichon Frises are known for their non-shedding hair, making them excellent companions for many people with allergies. However, regular grooming is a must!"
    }
];

export default function FAQPage() {
    return (
        <main className="pt-32 pb-24 bg-cream-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex p-3 rounded-2xl bg-sand-50 text-sand-600 mb-6 border border-sand-100">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-brown-900 mb-6 tracking-tight">
                            Got <span className="text-sand-600">Questions?</span>
                        </h1>
                        <p className="text-xl text-brown-800 leading-relaxed font-medium opacity-90 mb-8 max-w-xl">
                            Everything you need to know about our sanctuary, our puppies, and the adoption journey.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-cream-200 text-brown-900 font-bold shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                Instant Support
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-cream-200 text-brown-900 font-bold shadow-sm">
                                <MessageCircle className="h-5 w-5 text-sand-500" />
                                Live Assistance
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 relative"
                    >
                        <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative">
                            <img
                                src="/images/resources/faq-curious.png"
                                alt="Curious Bichon Puppy"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown-900/60 to-transparent p-10 pt-20">
                                <p className="text-white text-lg font-bold italic leading-tight">
                                    "I'm all ears... what's on your mind?"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 bg-white rounded-[2.5rem] border border-cream-200 shadow-sm hover:shadow-xl hover:border-sand-200 transition-all duration-300"
                        >
                            <h3 className="text-xl font-black text-brown-900 mb-4 group-hover:text-sand-600 transition-colors flex items-start gap-3">
                                <span className="text-sand-600 mt-1">Q.</span>
                                {faq.q}
                            </h3>
                            <div className="pl-8 border-l-2 border-cream-100 group-hover:border-sand-200 transition-colors">
                                <p className="text-brown-800 font-medium leading-relaxed opacity-90">
                                    {faq.a}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Still have questions? */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center bg-sand-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-sand-600/30"
                >
                    <h2 className="text-3xl font-extrabold mb-4">Still have questions?</h2>
                    <p className="text-xl text-cream-50 font-medium mb-8 max-w-xl mx-auto">
                        We're here to help! Our team is available to discuss your specific needs and guide you through the process.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-white text-sand-600 rounded-2xl font-black hover:bg-cream-50 transition-all"
                    >
                        Contact Our Team
                        <ChevronDown className="-rotate-90 h-4 w-4" />
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
