"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function EditPuppyPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const puppyId = unwrappedParams.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "", age: "", gender: "Male", adoption_fee: "", deposit_amount: "", status: "available"
    });


    useEffect(() => {
        const fetchPuppy = async () => {
            try {
                const { data, error } = await supabase
                    .from("puppies")
                    .select("*")
                    .eq("id", puppyId)
                    .single();

                if (error) throw error;

                if (data) {
                    setFormData({
                        name: data.name || "",
                        age: data.age || "",
                        gender: data.gender || "Male",
                        adoption_fee: String(data.adoption_fee || ""),
                        deposit_amount: String(data.deposit_amount || ""),
                        status: data.status || "available"
                    });
                    setExistingImages(data.puppy_images || []);
                }
            } catch (error) {
                console.error("Error fetching puppy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPuppy();
    }, [puppyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const removeImage = (index: number) => {
        const newImages = [...existingImages];
        newImages.splice(index, 1);
        setExistingImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
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

            const { error: updateError } = await supabase
                .from("puppies")
                .update({
                    name: formData.name,
                    age: formData.age,
                    gender: formData.gender,
                    adoption_fee: Number(formData.adoption_fee),
                    deposit_amount: Number(formData.deposit_amount),
                    status: formData.status,
                    puppy_images: [...existingImages, ...uploadedUrls]
                })
                .eq("id", puppyId);

            if (updateError) throw updateError;

            router.push("/admin/puppies");
        } catch (error) {
            console.error("Error updating puppy:", error);
            alert("Failed to update puppy.");
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse bg-white p-8 rounded-3xl border border-cream-200 min-h-[500px]"></div>;

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-cream-200">
                <h1 className="text-2xl font-extrabold text-brown-900">Edit Puppy</h1>
                <Link href="/admin/puppies" className="text-brown-800 hover:text-sand-600 font-medium text-sm">&larr; Back</Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Age</label>
                            <input type="text" name="age" required value={formData.age} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
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
                            <label className="block text-sm font-bold text-brown-900 mb-1">Fee ($)</label>
                            <input type="number" name="adoption_fee" required value={formData.adoption_fee} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brown-900 mb-1">Deposit ($)</label>
                            <input type="number" name="deposit_amount" required value={formData.deposit_amount} onChange={handleChange} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-cream-200">
                        <label className="block text-sm font-bold text-brown-900 mb-4">Manage Images</label>

                        {existingImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                {existingImages.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-cream-200 group">
                                        <img src={url} alt="puppy" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-2">
                            <label className="block text-sm text-brown-800 mb-2">Upload Additonal Images</label>
                            <input
                                type="file" multiple accept="image/*"
                                onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
                                className="w-full text-brown-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cream-100 file:text-brown-900 hover:file:bg-cream-200"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full bg-sand-600 text-white font-bold py-4 rounded-2xl hover:bg-sand-500 disabled:opacity-50 transition-colors mt-6 shadow-sm">
                        {saving ? "Saving Changes..." : "Update Puppy"}
                    </button>
                </form>
            </div>
        </div>
    );
}
