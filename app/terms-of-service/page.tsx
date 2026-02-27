"use client";

import { Scale, Heart, BadgeDollarSign, Truck } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 bg-white my-10 rounded-3xl border border-cream-200 shadow-sm">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-sand-100 rounded-2xl text-sand-600 mb-4">
                    <Scale className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Terms of Service</h1>
                <p className="text-brown-800">Last Updated: February 27, 2026</p>
            </div>

            <div className="space-y-8 text-brown-900 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="h-6 w-6 text-sand-500" />
                        1. Adoption Policy
                    </h2>
                    <p>
                        By submitting an adoption application on our site, you represent that all information provided is true and accurate. Submitting an application does not guarantee approval. Ellie's Sanctuary reserves the right to deny any application that does not meet our care standards.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BadgeDollarSign className="h-6 w-6 text-sand-500" />
                        2. Deposit and Refund Policy
                    </h2>
                    <p className="mb-4">
                        To secure a puppy after application approval, a deposit is required.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Deposits are refundable within 48 hours if you change your mind.</li>
                        <li>After 48 hours, deposits are generally non-refundable but can be transferred to a future litter.</li>
                        <li>Full payment is required prior to puppy transport or pickup.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Truck className="h-6 w-6 text-sand-500" />
                        3. Transport and Health Guarantee
                    </h2>
                    <p>
                        We provide specialized transport services. While we take every precaution to ensure the safety of the puppy during transport, specific delivery times may vary due to weather or airline schedules. Every puppy comes with a 1-year limited health guarantee against specific congenital defects, as outlined in our signed adoption contract.
                    </p>
                </section>

                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-100 italic text-brown-800">
                    <p>
                        Usage of this website constitutes acceptance of these terms. We reserve the right to modify these terms at any time.
                    </p>
                </section>
            </div>
        </div>
    );
}
