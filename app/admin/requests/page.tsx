"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { sendPushNotification } from "@/lib/supabase/push";

export default function AdminAdoptionRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const deleteRequest = async (id: string, puppyName: string) => {
        if (!confirm(`Are you sure you want to delete the application for ${puppyName}? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase
                .from("adoption_requests")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setRequests(requests.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting request:", error);
            alert("Failed to delete request.");
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data, error } = await supabase
                    .from("adoption_requests")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                if (data) setRequests(data);
            } catch (error) {
                console.error("Error fetching adoption requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

        const subscription = supabase
            .channel('public:adoption_requests_admin')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'adoption_requests'
            }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setRequests(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setRequests(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
                } else if (payload.eventType === 'DELETE') {
                    setRequests(prev => prev.filter(r => r.id === payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const updateStatus = async (id: string, newStatus: string, puppyId?: string, userId?: string, puppyName?: string) => {
        try {
            const { error: reqError } = await supabase
                .from("adoption_requests")
                .update({ status: newStatus })
                .eq("id", id);

            if (reqError) throw reqError;

            // If approved, automatically update the puppy's status to "adopted"
            if (newStatus === "approved" && puppyId) {
                const { error: puppyError } = await supabase
                    .from("puppies")
                    .update({ status: "adopted" })
                    .eq("id", puppyId);

                if (puppyError) throw puppyError;
            }

            // Create a notification for the user
            if (userId && puppyName) {
                let message = "";
                if (newStatus === "approved") {
                    message = `Congratulations! Your adoption application for ${puppyName} has been approved. Please contact support to proceed with the refundable deposit.`;
                } else if (newStatus === "rejected") {
                    message = `We're sorry, but your adoption application for ${puppyName} could not be approved at this time.`;
                }

                if (message) {
                    await supabase.from("notifications").insert({
                        user_id: userId,
                        message: message,
                        read: false
                    });

                    // Also send push notification
                    await sendPushNotification(
                        userId,
                        "Adoption Update",
                        message,
                        "/dashboard"
                    );
                }
            }

        } catch (error) {
            console.error("Error updating request status:", error);
            alert("Failed to update status.");
        }
    };

    if (loading) return <div className="animate-pulse bg-white p-8 rounded-3xl border border-cream-200 h-64"></div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream-200">
                <h1 className="text-2xl font-extrabold text-brown-900">Adoption Requests</h1>
                <p className="text-brown-800 text-sm mt-1">Review and manage incoming applications</p>
            </div>

            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-cream-200 flex flex-col lg:flex-row gap-6 lg:items-center hover:shadow-md transition-shadow">
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-brown-900">Application for {req.puppy_name}</h3>
                                    <p className="text-brown-800 text-sm">{req.first_name} {req.last_name} • {req.phone} • {req.email}</p>
                                </div>
                                <span className={`px-3 py-1 mt-2 lg:mt-0 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {req.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                                    {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                    {req.status === 'pending' && <Clock className="h-3 w-3" />}
                                    {req.status}
                                </span>
                            </div>

                            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-brown-900 text-sm border-b border-cream-200 pb-1 mb-2">Applicant Info</h4>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Address:</strong> {req.address}, {req.city}, {req.state} {req.zip}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Contact Method:</strong> {req.application_data?.contact_method || req.contact_method || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Occupation:</strong> {req.application_data?.occupation || req.occupation || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Work Hours:</strong> {req.application_data?.work_hours || req.work_hours || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-brown-900 text-sm border-b border-cream-200 pb-1 mb-2">Household & Care</h4>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Residence:</strong> {req.application_data?.residence_type || req.residence_type || 'N/A'} ({req.application_data?.rent_or_own || req.rent_or_own})</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Members:</strong> {req.application_data?.household_members || req.household_members || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Other Pets:</strong> {req.application_data?.other_pets || req.other_pets || 'None'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Daytime Care:</strong> {req.application_data?.daytime_care || req.daytime_care || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Fencing:</strong> {req.application_data?.yard_fencing || req.yard_fencing || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-brown-900 text-sm border-b border-cream-200 pb-1 mb-2">Preferences & Experience</h4>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Reason:</strong> {req.application_data?.adoption_reason || req.adoption_reason || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Experience:</strong> {req.application_data?.pet_experience || req.pet_experience || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Vet Info:</strong> {req.application_data?.veterinarian_info || req.veterinarian_info || 'N/A'}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Deposit Amt:</strong> ${req.deposit_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-brown-900 text-sm border-b border-cream-200 pb-1 mb-2">Commitments & Consent</h4>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Financial Ability:</strong> {req.application_data?.financial_ability ? 'Yes' : (req.financial_ability ? 'Yes' : 'No')}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Spay/Neuter:</strong> {req.application_data?.agree_to_spay_neuter ? 'Yes' : (req.agree_to_spay_neuter ? 'Yes' : 'No')}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Training:</strong> {req.application_data?.training_commitment ? 'Yes' : (req.training_commitment ? 'Yes' : 'No')}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Home Visit Consent:</strong> {req.application_data?.consent_home_visit ? 'Yes' : (req.consent_home_visit ? 'Yes' : 'No')}</p>
                                    <p className="text-xs text-brown-900"><strong className="text-brown-800">Signature:</strong> {req.application_data?.signature || req.signature || 'N/A'}</p>
                                </div>
                            </div>

                            <p className="text-xs text-brown-800/60 mt-4 text-right">
                                Applied: {req.created_at ? new Date(req.created_at).toLocaleString() : 'Recently'}
                            </p>
                        </div>

                        {req.status === "pending" ? (
                            <div className="flex lg:flex-col gap-3 shrink-0">
                                <button
                                    onClick={() => updateStatus(req.id, "approved", req.puppy_id, req.user_id, req.puppy_name)}
                                    className="flex-1 lg:flex-none justify-center bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                                >
                                    Approve App
                                </button>
                                <button
                                    onClick={() => updateStatus(req.id, "rejected", undefined, req.user_id, req.puppy_name)}
                                    className="flex-1 lg:flex-none justify-center bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-colors border border-red-100"
                                >
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <div className="flex lg:flex-col gap-3 shrink-0">
                                <button
                                    onClick={() => deleteRequest(req.id, req.puppy_name)}
                                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete Request"
                                >
                                    <Trash2 className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-3xl border border-cream-200 shadow-sm text-brown-800">
                        No adoption requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
