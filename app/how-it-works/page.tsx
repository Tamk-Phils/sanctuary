import { ClipboardCheck, Sparkles, Truck } from "lucide-react";

export default function HowItWorksPage() {
    const steps = [
        {
            title: "1. Find Your Match",
            description: "Browse our available puppies and find the one that steals your heart. Each profile includes detailed photos and information.",
            icon: <Sparkles className="h-8 w-8 text-sand-600" />
        },
        {
            title: "2. Submit a Request",
            description: "When you are ready, you can submit an adoption request by placing a secure deposit. We'll review your application to ensure a great fit.",
            icon: <ClipboardCheck className="h-8 w-8 text-sand-600" />
        },
        {
            title: "3. Safe Delivery",
            description: "Once approved, we arrange safe and comfortable transportation for your puppy, right to your doorstep anywhere in our supported regions.",
            icon: <Truck className="h-8 w-8 text-sand-600" />
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900 tracking-tight">How It Works</h1>
                <p className="mt-4 text-xl text-brown-800">
                    Our specialized adoption process ensures a smooth journey for both you and your new companion.
                </p>
            </div>

            <div className="space-y-12">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-cream-200">
                        <div className="bg-cream-100 p-4 rounded-full flex-shrink-0">
                            {step.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-brown-900 mb-2">{step.title}</h3>
                            <p className="text-brown-800 text-lg leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
