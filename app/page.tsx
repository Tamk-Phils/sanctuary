"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { Heart, ShieldCheck, Truck, Star, Award, CheckCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

export default function Home() {
  const [featured, setFeatured] = useState<Puppy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from("puppies")
          .select("*")
          .eq("status", "available")
          .limit(3);

        if (error) {
          throw error;
        }

        if (data) {
          setFeatured(data as Puppy[]);
        }
      } catch (error) {
        console.error("Error fetching featured puppies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();

    // Set up realtime subscription
    const subscription = supabase
      .channel('public:puppies')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'puppies',
        filter: "status=eq.available"
      }, () => {
        fetchFeatured(); // Re-fetch on any change indicating available puppies changed
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const reviews = [
    {
      name: "Sarah T.",
      location: "Los Angeles, CA",
      text: "Getting our little Oliver from Ellie's Sanctuary was the best decision. He arrived healthy, happy, and so well-socialized. The process was incredibly professional from start to finish.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      name: "Michael & Emily R.",
      location: "Toronto, Canada",
      text: "We were nervous about the shipping process, but Ellie kept us updated every step of the way. Bella was delivered right to our door safely. Highly recommend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
    },
    {
      name: "Jessica M.",
      location: "Sydney, Australia",
      text: "A truly 5-star experience. The health guarantee and clear communication gave us so much peace of mind. Our pup Milo is the joy of our household!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-sand-600 pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center min-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-black/60"
        >
          <img
            src="/images/hero-bg.png"
            alt="Happy Bichon Frise puppy looking bright and joyful"
            className="w-full h-full object-cover object-center mix-blend-overlay"
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
              <Link href="/browse" className="bg-brown-900 text-white px-8 py-5 rounded-full font-bold text-xl hover:bg-brown-800 transition shadow-2xl hover:shadow-brown-900/50 hover:-translate-y-1 flex items-center justify-center gap-2">
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
              <img
                src="/images/hero-bg.png"
                alt="Adorable white Bichon sitting"
                className="w-full h-[400px] rounded-xl object-cover"
              />
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

      {/* 2. Trust Badges */}
      <section className="bg-white py-10 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-brown-800 opacity-80 flex flex-col items-center">
          <p className="text-sm font-bold tracking-widest uppercase mb-6">Trusted By Families Across</p>
          <div className="flex flex-wrap justify-center gap-12 text-lg font-bold">
            <span>🇺🇸 USA</span>
            <span>🇨🇦 Canada</span>
            <span>🇦🇺 Australia</span>
            <span>🇬🇧 UK</span>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition */}
      <section className="bg-cream-50 py-24 px-4 sm:px-6 lg:px-8 border-b border-cream-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-brown-900 mb-4">The Ellie's Sanctuary Difference</h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              We go above and beyond standard breeding practices. Every puppy is a cherished member of our family before they become yours.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {[
              { icon: <Heart className="h-10 w-10" />, title: "In-Home Raised", desc: "Raised underfoot in our living room—not in a kennel. They are socialized with children, adults, and everyday household sounds for a confident temperament." },
              { icon: <ShieldCheck className="h-10 w-10" />, title: "1-Year Health Guarantee", desc: "We stringently test parent genetics. Each puppy comes with a comprehensive signed contract protecting against severe congenital defects." },
              { icon: <Truck className="h-10 w-10" />, title: "VIP Safe Transport", desc: "We hand-deliver puppies via a trusted specialized flight nanny in cabin, or safe ground transport right to your doorstep to minimize stress." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-cream-200 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-sand-500 transform origin-left transition-transform group-hover:scale-x-100 scale-x-0 duration-300"></div>
                <div className="bg-cream-100 p-6 rounded-full text-sand-500 border border-cream-200 mb-6 group-hover:bg-sand-500 group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-brown-900 mb-4">{feature.title}</h3>
                <p className="text-brown-800 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Featured Puppies */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-4xl font-extrabold text-brown-900 mb-4">Ready For Adoption</h2>
            <p className="text-lg text-brown-800 max-w-2xl">
              Meet our latest available puppies. They are up-to-date on shots and ready for their forever homes.
            </p>
          </div>
          <Link href="/browse" className="hidden md:inline-flex bg-cream-200 text-brown-900 px-6 py-3 rounded-full font-bold hover:bg-cream-300 transition-colors whitespace-nowrap items-center gap-2">
            View All Puppies <span aria-hidden="true">&rarr;</span>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
          </div>
        ) : featured.length > 0 ? (
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.map((pup) => (
              <motion.div variants={fadeIn} key={pup.id}>
                <Link href={`/puppies/${pup.id}`} className="group block h-full">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-cream-200 flex flex-col h-full transform group-hover:-translate-y-2">
                    <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brown-900 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm border border-cream-200">
                        {pup.gender}
                      </div>
                      {pup.puppy_images && pup.puppy_images.length > 0 ? (
                        <img
                          src={pup.puppy_images[0]}
                          alt={pup.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
        ) : (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center bg-white p-16 rounded-3xl border border-cream-200 shadow-sm text-brown-800 flex flex-col items-center">
            {/* Dog icon svg omitted for brevity, keeping simple design */}
            <div className="bg-cream-100 p-6 rounded-full mb-4">
              <Heart className="h-10 w-10 text-sand-500" />
            </div>
            <p className="text-xl font-medium text-brown-900">All our current litters have found homes!</p>
            <p className="mt-2 text-brown-800/80">Check back soon for upcoming litters, or contact us to join the waitlist.</p>
          </motion.div>
        )}
      </section>

      {/* 5. Reviews Section */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-y border-cream-200">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-yellow-400">
              <Star className="h-8 w-8 fill-current drop-shadow-sm" />
              <Star className="h-8 w-8 fill-current drop-shadow-sm" />
              <Star className="h-8 w-8 fill-current drop-shadow-sm" />
              <Star className="h-8 w-8 fill-current drop-shadow-sm" />
              <Star className="h-8 w-8 fill-current drop-shadow-sm" />
            </div>
            <h2 className="text-4xl font-extrabold text-brown-900 mb-4">Happy Families</h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              Don't just take our word for it. Read what our loving families have to say about their experience getting a puppy from us.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-cream-50 p-8 rounded-3xl border border-cream-200 flex flex-col shadow-sm transition-all"
              >
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-brown-800 italic leading-relaxed mb-8 flex-1">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-brown-900">{review.name}</h4>
                    <p className="text-xs text-brown-800 opacity-80">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Life at the Sanctuary / Instagram Style Gallery with Bichon Frise images */}
      <section className="bg-cream-100 py-24 px-4 sm:px-6 lg:px-8 border-b border-cream-200 overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brown-900 mb-4">Life At The Sanctuary</h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            A glimpse into the daily joy, playtime, and immense love our Bichon Frise puppies experience.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          <motion.div variants={fadeIn} className="col-span-2 md:col-span-2 aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group relative">
            <div className="absolute inset-0 bg-sand-600/0 group-hover:bg-sand-600/20 transition-colors z-10 duration-500 rounded-3xl pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1587539975099-5aecb74902d4?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Bichon puppy playing" />
          </motion.div>

          <motion.div variants={fadeIn} className="aspect-square rounded-3xl overflow-hidden shadow-sm group relative">
            <div className="absolute inset-0 bg-sand-600/0 group-hover:bg-sand-600/20 transition-colors z-10 duration-500 rounded-3xl pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1652900186700-1266fdafd5a7?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Bichon Frise" />
          </motion.div>

          <motion.div variants={fadeIn} className="aspect-square rounded-3xl overflow-hidden shadow-sm group relative">
            <div className="absolute inset-0 bg-sand-600/0 group-hover:bg-sand-600/20 transition-colors z-10 duration-500 rounded-3xl pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1696254643239-eeb065e3f35a?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="White dog running" />
          </motion.div>

          <motion.div variants={fadeIn} className="aspect-square rounded-3xl overflow-hidden shadow-sm group hidden md:block relative">
            <div className="absolute inset-0 bg-sand-600/0 group-hover:bg-sand-600/20 transition-colors z-10 duration-500 rounded-3xl pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1554634242-a653caa56834?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Smiling puppy" />
          </motion.div>

          <motion.div variants={fadeIn} className="col-span-2 md:col-span-3 aspect-[21/9] rounded-3xl overflow-hidden shadow-sm group relative">
            <div className="absolute inset-0 bg-sand-600/0 group-hover:bg-sand-600/20 transition-colors z-10 duration-500 rounded-3xl pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1557674751-0208d529d2a1?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Puppy portrait" />
          </motion.div>
        </motion.div>
      </section>

      {/* 7. Final Conversion Section */}
      <section className="bg-sand-600 relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3">
          <Heart className="w-[600px] h-[600px] text-sand-500 opacity-30 animate-pulse" />
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
            Ready to Welcome a New Best Friend?
          </h2>
          <p className="text-xl md:text-2xl text-cream-50 mb-12 font-medium max-w-2xl mx-auto">
            Contact us today to ask any questions or start the adoption application process. Spaces in upcoming litters fill quickly!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/browse" className="bg-white text-sand-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-cream-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
              Find Your Puppy
            </Link>
            <Link href="/login" className="bg-brown-900 border border-transparent text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-brown-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
              Apply For Adoption
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
