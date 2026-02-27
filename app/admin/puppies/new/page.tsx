"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPuppyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "Male",
        adoption_fee: "",
        deposit_amount: "",
        status: "available"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images to our internal Next.js API route
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch('/api/upload', {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                }
            }

            // 2. Save Document to Supabase
            const { error: insertError } = await supabase.from("puppies").insert({
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                adoption_fee: Number(formData.adoption_fee),
                deposit_amount: Number(formData.deposit_amount),
                status: formData.status,
                puppy_images: uploadedUrls
            });

            if (insertError) throw insertError;

            router.push("/admin/puppies");
        } catch (error) {
            console.error("Error creating puppy:", error);
            alert("Failed to create puppy.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-cream-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-brown-900">Add New Puppy</h1>
                </div>
                <Link href="/admin/puppies" className="text-brown-800 hover:text-sand-600 font-medium text-sm">&larr; Back to Inventory</Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. Bella" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Age</label>
                            <input type="text" name="age" required value={formData.age} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. 8 Weeks" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="adopted">Adopted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Total Adoption Fee ($)</label>
                            <input type="number" name="adoption_fee" required value={formData.adoption_fee} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="1500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Required Deposit ($)</label>
                            <input type="number" name="deposit_amount" required value={formData.deposit_amount} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="500" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-cream-200">
                        <label className="block text-sm font-bold text-brown-900 mb-2">Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(Array.from(e.target.files));
                                }
                            }}
                            className="w-full text-brown-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cream-100 file:text-brown-900 hover:file:bg-cream-200"
                        />
                        {files.length > 0 && <p className="text-sm text-brown-800 mt-2">{files.length} file(s) selected</p>}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-sand-600 text-white font-bold py-4 rounded-2xl hover:bg-sand-500 disabled:opacity-50 transition-colors mt-6 shadow-sm">
                        {loading ? "Saving Puppy..." : "Add Puppy"}
                    </button>
                </form>
            </div>
        </div>
    );
}
