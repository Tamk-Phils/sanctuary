"use client";

import Image from "next/image";
import { Star, CheckCircle, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

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

export default function HomeHeroClient() {
    return (
        <section className="relative bg-sand-600 pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center min-h-[90vh]">
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0 bg-black/40"
            >
                <Image
                    src="/images/hero-bg.png"
                    alt="Happy Bichon Frise puppy looking bright and joyful"
                    fill
                    priority
                    fetchPriority="high"
                    className="object-cover object-center"
                />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
                <motion.div
                    className="flex-1 text-center md:text-left"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 mb-6 shadow-sm">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Top Rated Bichon Breeders Since 2012</span>
                    </motion.div>

                    <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
                        Bring Home <br /> <span className="text-sand-300">Pure Joy Today.</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} className="text-xl md:text-2xl text-cream-50 max-w-2xl mx-auto md:mx-0 mb-10 drop-shadow-md font-medium">
                        Healthy, family-raised Bichon Frise puppies delivered safely to your door with a comprehensive 1-year health guarantee.
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href="/browse"
                            aria-label="Browse all available Bichon Frise puppies"
                            className="bg-brown-900 text-white px-8 py-5 rounded-full font-bold text-xl hover:bg-brown-800 transition shadow-2xl hover:shadow-brown-900/50 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            View Available Puppies <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeIn} className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="font-medium text-sm drop-shadow-md">Vet Checked & Vaccinated</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="font-medium text-sm drop-shadow-md">Safe Global Transport</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="font-medium text-sm drop-shadow-md">Microchipped</span>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="flex-1 hidden md:block"
                >
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="bg-white p-4 rounded-3xl shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500 max-w-md mx-auto relative border-[8px] border-white ring-1 ring-cream-200"
                    >
                        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                            <Image
                                src="/images/hero-bg.png"
                                alt="Adorable white Bichon sitting"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-sand-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                            <Award className="h-8 w-8" />
                            <div>
                                <p className="font-bold text-sm">Premium</p>
                                <p className="font-extrabold text-lg leading-none">Lineage</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

