"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 bg-white my-10 rounded-3xl border border-cream-200 shadow-sm">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-sand-100 rounded-2xl text-sand-600 mb-4">
                    <Shield className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Privacy Policy</h1>
                <p className="text-brown-800">Last Updated: February 27, 2026</p>
            </div>

            <div className="space-y-8 text-brown-900 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="h-6 w-6 text-sand-500" />
                        1. Information We Collect
                    </h2>
                    <p className="mb-4">
                        At Ellie's Bichon Frise Sanctuary, we collect information that you provide directly to us when you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Create an account or login via our secure authentication system.</li>
                        <li>Fill out an adoption application form.</li>
                        <li>Communicate with us via our internal chat system.</li>
                        <li>Provide contact information for puppy updates.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="h-6 w-6 text-sand-500" />
                        2. How We Use Your Information
                    </h2>
                    <p className="mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and evaluate your puppy adoption application.</li>
                        <li>Facilitate communication between users and our administrative team.</li>
                        <li>Send notifications regarding your application status.</li>
                        <li>Improve our services and user experience.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-sand-500" />
                        3. Data Security and Third Parties
                    </h2>
                    <p>
                        We use Supabase for secure data storage and authentication. Your data is protected using industry-standard encryption and security protocols.
                        We do not sell your personal information to third parties. We only share information with partners necessary to facilitate adoption (e.g., specialized transport services) with your explicit consent.
                    </p>
                </section>

                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-100 italic text-brown-800">
                    <p>
                        By using this site, you agree to the collection and use of information in accordance with this policy. We may update this policy periodically to reflect changes in our practices.
                    </p>
                </section>
            </div>
        </div>
    );
}
