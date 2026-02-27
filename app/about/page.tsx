import { Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <Heart className="h-12 w-12 text-sand-600 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900 tracking-tight">Our Story</h1>
                <p className="mt-4 text-xl text-brown-800">
                    A lifelong passion for Bichon Frises turned into a sanctuary of love.
                </p>
            </div>

            <div className="prose prose-lg prose-brown max-w-none space-y-6">
                <p className="text-lg text-brown-800 leading-relaxed">
                    Welcome to Ellie's Bichon Frise Sanctuary. What started as a small, family-run effort to care for a single Bichon Frise has blossomed into a full sanctuary dedicated to this incredible breed. We have spent years understanding their unique needs, temperaments, and personalities.
                </p>
                <h2 className="text-2xl font-bold text-brown-900 mt-10 mb-4">Our Environment</h2>
                <p className="text-lg text-brown-800 leading-relaxed">
                    Our sanctuary ensures every puppy is raised in a warm, family-oriented environment. We believe that the first few weeks of a puppy's life are critical for their emotional and physical development. That's why they are socialized daily, exposed to household sounds, and given endless affection.
                </p>
                <h2 className="text-2xl font-bold text-brown-900 mt-10 mb-4">Health and Care</h2>
                <p className="text-lg text-brown-800 leading-relaxed">
                    Health is our top priority. We work closely with our local veterinarians to ensure that our breeding practices are ethical, and every puppy receives comprehensive health checks, initial vaccinations, and a microchip before joining their new family.
                </p>
            </div>
        </div>
    );
}
