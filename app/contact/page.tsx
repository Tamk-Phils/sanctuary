"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Dog } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "contact",
                    name,
                    email,
                    subject,
                    message,
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            setSubmitted(true);
        } catch (err: any) {
            console.error("Contact form error:", err);
            setError("Something went wrong. Please try again or contact us via live chat.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-cream-200">
                    <div className="bg-sand-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                    <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Message Sent!</h1>
                    <p className="text-brown-800 text-lg mb-8">
                        Thank you for reaching out to Ellie's Sanctuary. We've received your message and will get back to you as soon as possible.
                    </p>
                    <Link href="/" className="bg-sand-600 text-white font-bold py-3 px-8 rounded-full hover:bg-sand-500 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900 mb-4">Contact Us</h1>
                <p className="text-brown-800 text-lg max-w-2xl mx-auto">
                    Have questions about our puppies or the adoption process? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
                        <h2 className="text-2xl font-bold text-brown-900 mb-8 border-b border-cream-200 pb-2">Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-cream-100 p-3 rounded-2xl text-sand-600">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-brown-900">Email</p>
                                    <p className="text-brown-800">hello@elliesanctuary.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cream-100 p-3 rounded-2xl text-sand-600">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-brown-900">Phone</p>
                                    <p className="text-brown-800">(555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cream-100 p-3 rounded-2xl text-sand-600">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-brown-900">Sanctuary</p>
                                    <p className="text-brown-800">Bichon Lane, Florida, USA</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-cream-50 rounded-2xl border border-cream-200">
                            <h3 className="font-bold text-brown-900 mb-2 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-sand-600" />
                                Live Chat
                            </h3>
                            <p className="text-sm text-brown-800 mb-4">
                                Need an instant answer? Chat with us live!
                            </p>
                            <Link href="/chat" className="text-sand-600 font-bold hover:underline inline-flex items-center gap-1">
                                Open Chat <Send className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-sand-600 p-8 rounded-3xl shadow-sm text-white">
                        <Dog className="h-12 w-12 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Adoption Questions?</h3>
                        <p className="text-white/80 mb-6">
                            Visit our FAQ page for quick answers to common questions about our adoption process.
                        </p>
                        <Link href="/faq" className="inline-block bg-white text-sand-600 px-6 py-3 rounded-full font-bold hover:bg-cream-50 transition-colors">
                            Read FAQ
                        </Link>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-cream-200 h-full">
                        <h2 className="text-2xl font-bold text-brown-900 mb-8">Send us a Message</h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full px-5 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="w-full px-5 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full px-5 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none transition-all resize-none"
                                    placeholder="Enter your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-sand-600 text-white font-bold py-5 px-6 rounded-2xl hover:bg-sand-500 transition-colors disabled:opacity-50 text-lg shadow-sm flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : (
                                    <>
                                        Send Message <Send className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
