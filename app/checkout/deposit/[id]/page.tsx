"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/supabase/context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const puppyId = unwrappedParams.id;
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [puppy, setPuppy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Applicant Information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactMethod, setContactMethod] = useState("Email");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [phone, setPhone] = useState("");

    // Household & Lifestyle
    const [residenceType, setResidenceType] = useState("House");
    const [rentOrOwn, setRentOrOwn] = useState("Own");
    const [householdMembers, setHouseholdMembers] = useState("");
    const [otherPets, setOtherPets] = useState("");
    const [yardFencing, setYardFencing] = useState("");

    // Employment
    const [occupation, setOccupation] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [daytimeCare, setDaytimeCare] = useState("");

    // Preferences
    const [breedSizePreference, setBreedSizePreference] = useState("Bichon Frise");
    const [agePreference, setAgePreference] = useState("Puppy");
    const [genderPreference, setGenderPreference] = useState("");
    const [adoptionReason, setAdoptionReason] = useState("");

    // Care
    const [petExperience, setPetExperience] = useState("");
    const [veterinarianInfo, setVeterinarianInfo] = useState("");
    const [financialAbility, setFinancialAbility] = useState(false);
    const [agreeToSpayNeuter, setAgreeToSpayNeuter] = useState(false);
    const [trainingCommitment, setTrainingCommitment] = useState(false);

    // Legal
    const [ackPolicies, setAckPolicies] = useState(false);
    const [consentHomeVisit, setConsentHomeVisit] = useState(false);
    const [signature, setSignature] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push(`/login?redirect=/checkout/deposit/${puppyId}`);
            return;
        }

        if (user && user.email) {
            setEmail(user.email);
            setFirstName(user.user_metadata?.first_name || "");
            setLastName(user.user_metadata?.last_name || "");
        }

        const fetchPuppy = async () => {
            try {
                const { data, error } = await supabase
                    .from("puppies")
                    .select("*")
                    .eq("id", puppyId)
                    .single();

                if (error) throw error;

                if (data) {
                    setPuppy(data);
                }
            } catch (error) {
                console.error("Error fetching puppy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPuppy();
    }, [puppyId, user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit triggered. User:", user?.id, "Puppy:", puppy?.id);

        if (!user || !puppy) {
            console.error("User or Puppy not loaded.");
            return;
        }

        setSubmitting(true);

        // Bundle all extended fields into a JSONB object
        const applicationData = {
            email,
            contact_method: contactMethod,
            residence_type: residenceType,
            rent_or_own: rentOrOwn,
            household_members: householdMembers,
            other_pets: otherPets,
            yard_fencing: yardFencing,
            occupation,
            work_hours: workHours,
            daytime_care: daytimeCare,
            breed_size_preference: breedSizePreference,
            age_preference: agePreference,
            gender_preference: genderPreference,
            adoption_reason: adoptionReason,
            pet_experience: petExperience,
            veterinarian_info: veterinarianInfo,
            financial_ability: financialAbility,
            agree_to_spay_neuter: agreeToSpayNeuter,
            training_commitment: trainingCommitment,
            consent_home_visit: consentHomeVisit,
            signature
        };

        const payload: any = {
            puppy_id: puppyId,
            user_id: user.id,
            status: "pending",
            first_name: firstName || user?.user_metadata?.first_name || "Unknown",
            last_name: lastName || user?.user_metadata?.last_name || "Unknown",
            puppy_name: puppy.name,
            address,
            city,
            state,
            zip,
            phone,
            deposit_amount: puppy.deposit_amount,
            agreed_to_terms: ackPolicies,
            application_data: applicationData, // This is our flexible storage
        };

        // For backward compatibility while the user's cache is stale, 
        // we can still send core identifying fields if they exist in the schema,
        // but we wrap them in a try-catch for the insert if needed.
        // However, Supabase's JS library will fail the request if we send unknown columns.
        // So we strictly send only columns we KNOW are in the stable core schema.

        console.log("Payload prepared (using JSONB):", payload);

        try {
            const { data, error: insertError } = await supabase
                .from("adoption_requests")
                .insert(payload)
                .select();

            console.log("Insert response:", { data, error: insertError });

            if (insertError) throw insertError;
            setSuccess(true);
        } catch (error: any) {
            console.error("CRITICAL ERROR submitting request:", error);

            // If it failed because of a column error, try a "SAFE" fallback with just the core
            if (error.code === "PGRST204" || error.message?.includes("column")) {
                console.log("Retrying with minimal payload...");
                const minimalPayload = {
                    puppy_id: puppyId,
                    user_id: user.id,
                    status: "pending",
                    first_name: firstName || "Unknown",
                    last_name: lastName || "Unknown",
                    puppy_name: puppy.name,
                    address: address || "See details",
                    city: city || "N/A",
                    state: state || "N/A",
                    zip: zip || "N/A",
                    phone: phone || "N/A",
                    deposit_amount: puppy.deposit_amount,
                    agreed_to_terms: ackPolicies,
                };

                const { error: retryError } = await supabase.from("adoption_requests").insert(minimalPayload);
                if (!retryError) {
                    setSuccess(true);
                    return;
                }
            }

            alert(`Failed to submit: ${error.message || "Unknown error"}. Please check your internet connection and try again.`);
        } finally {
            setSubmitting(false);
            console.log("Submission process finished.");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
            </div>
        );
    }

    if (!puppy) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-brown-900">Puppy not found.</h1>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-cream-200">
                    <div className="bg-sand-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                    <h1 className="text-4xl font-extrabold text-brown-900 mb-4">Request Submitted!</h1>
                    <p className="text-brown-800 text-lg mb-8">
                        Thank you for applying to adopt {puppy.name}. We've received your request and will review it shortly.
                        <strong> Please contact support at support@elliesanctuary.com or via Live Chat to proceed with the payment of the refundable deposit.</strong>
                    </p>
                    <Link href="/browse" className="bg-sand-600 text-white font-bold py-3 px-8 rounded-full hover:bg-sand-500 transition-colors">
                        Return to Browse
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href={`/puppies/${puppyId}`} className="text-sand-600 hover:underline mb-8 inline-block font-medium">&larr; Back to puppy details</Link>

            <div className="bg-white rounded-3xl shadow-sm border border-cream-200 overflow-hidden">
                <div className="bg-cream-100 p-8 border-b border-cream-200 flex items-center gap-6">
                    {puppy.puppy_images && puppy.puppy_images.length > 0 ? (
                        <img src={puppy.puppy_images[0]} alt={puppy.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center border-4 border-white shadow-sm font-bold text-xl text-brown-900">{puppy.name[0]}</div>
                    )}
                    <div>
                        <h1 className="text-3xl font-extrabold text-brown-900">Adopt {puppy.name}</h1>
                        <p className="text-brown-800 mt-1">Required Deposit: <span className="font-bold text-brown-900">${puppy.deposit_amount}</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Applicant Information */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2">Applicant Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">First Name</label>
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Last Name</label>
                            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Address</label>
                            <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="123 Puppy Lane" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">City</label>
                            <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">State</label>
                            <input type="text" required value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">ZIP / Postal Code</label>
                            <input type="text" required value={zip} onChange={e => setZip(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Phone Number</label>
                            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="(555) 123-4567" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Preferred Contact Method</label>
                            <select value={contactMethod} onChange={e => setContactMethod(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option value="Email">Email</option>
                                <option value="Phone">Phone</option>
                                <option value="Text">Text</option>
                            </select>
                        </div>
                    </div>

                    {/* Household & Lifestyle */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2 mt-8">Household & Lifestyle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Type of Residence</label>
                            <select value={residenceType} onChange={e => setResidenceType(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option value="House">House</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Farm">Farm</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Do you rent or own?</label>
                            <select value={rentOrOwn} onChange={e => setRentOrOwn(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option value="Own">Own</option>
                                <option value="Rent">Rent (Landlord permission required)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Household Members (adults, children, ages)</label>
                            <input type="text" required value={householdMembers} onChange={e => setHouseholdMembers(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. 2 adults, 1 child (age 5)" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Other Pets (species, breed, age, vaccinated?)</label>
                            <input type="text" value={otherPets} onChange={e => setOtherPets(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. 1 cat, domestic shorthair, 3 yrs, vaccinated. (Leave blank if none)" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Yard / Fencing Availability</label>
                            <input type="text" required value={yardFencing} onChange={e => setYardFencing(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. Fully fenced backyard" />
                        </div>
                    </div>

                    {/* Employment & Availability */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2 mt-8">Employment & Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Occupation & Employment Status</label>
                            <input type="text" required value={occupation} onChange={e => setOccupation(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Work Hours / Time Away</label>
                            <input type="text" required value={workHours} onChange={e => setWorkHours(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="e.g. 9am-5pm, Mon-Fri" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Daytime Puppy Care</label>
                            <input type="text" required value={daytimeCare} onChange={e => setDaytimeCare(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="Who will care for the puppy?" />
                        </div>
                    </div>

                    {/* Puppy Preferences */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2 mt-8">Puppy Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Breed / Size Preference</label>
                            <input type="text" value={breedSizePreference} onChange={e => setBreedSizePreference(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Age Preference</label>
                            <select value={agePreference} onChange={e => setAgePreference(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none">
                                <option value="Puppy">Puppy</option>
                                <option value="Young">Young</option>
                                <option value="Adult">Adult</option>
                                <option value="Senior">Senior</option>
                                <option value="No preference">No preference</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Gender Preference</label>
                            <input type="text" value={genderPreference} onChange={e => setGenderPreference(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="Optional" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Reason for Adoption</label>
                            <input type="text" required value={adoptionReason} onChange={e => setAdoptionReason(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="Family pet, companionship..." />
                        </div>
                    </div>

                    {/* Care & Commitment */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2 mt-8">Care & Commitment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Experience with Pets</label>
                            <textarea required rows={3} value={petExperience} onChange={e => setPetExperience(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none resize-none" placeholder="Tell us about previous pet ownership..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brown-900 mb-1">Veterinarian Info (Current or Planned)</label>
                            <input type="text" required value={veterinarianInfo} onChange={e => setVeterinarianInfo(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="Clinic name, phone, or 'Will find local vet'" />
                        </div>
                        <div className="flex items-start gap-3 md:col-span-2 mt-2">
                            <input type="checkbox" required checked={financialAbility} onChange={e => setFinancialAbility(e.target.checked)} className="w-5 h-5 mt-1 accent-sand-600" id="financialAbility" />
                            <label htmlFor="financialAbility" className="text-sm font-medium text-brown-900">I confirm I have the financial ability to cover food, vet care, grooming, and other expenses.</label>
                        </div>
                        <div className="flex items-start gap-3 md:col-span-2">
                            <input type="checkbox" required checked={agreeToSpayNeuter} onChange={e => setAgreeToSpayNeuter(e.target.checked)} className="w-5 h-5 mt-1 accent-sand-600" id="agreeToSpayNeuter" />
                            <label htmlFor="agreeToSpayNeuter" className="text-sm font-medium text-brown-900">I agree to spay/neuter the puppy at the appropriate age (if not already done).</label>
                        </div>
                        <div className="flex items-start gap-3 md:col-span-2">
                            <input type="checkbox" required checked={trainingCommitment} onChange={e => setTrainingCommitment(e.target.checked)} className="w-5 h-5 mt-1 accent-sand-600" id="trainingCommitment" />
                            <label htmlFor="trainingCommitment" className="text-sm font-medium text-brown-900">I am committed to providing proper training and socialization for the puppy.</label>
                        </div>
                    </div>

                    {/* Legal & Consent */}
                    <h3 className="text-xl font-bold text-brown-900 mb-4 border-b border-cream-200 pb-2 mt-8">Legal & Consent</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" required checked={ackPolicies} onChange={e => setAckPolicies(e.target.checked)} className="w-5 h-5 mt-1 accent-sand-600" id="ackPolicies" />
                            <label htmlFor="ackPolicies" className="text-sm font-medium text-brown-900">I acknowledge and agree to the adoption/rescue policies of Ellie's Sanctuary.</label>
                        </div>
                        <div className="flex items-start gap-3">
                            <input type="checkbox" required checked={consentHomeVisit} onChange={e => setConsentHomeVisit(e.target.checked)} className="w-5 h-5 mt-1 accent-sand-600" id="consentHomeVisit" />
                            <label htmlFor="consentHomeVisit" className="text-sm font-medium text-brown-900">I consent to a reference check or home visit if deemed necessary.</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brown-900 mb-1">Signature & Date</label>
                            <input type="text" required value={signature} onChange={e => setSignature(e.target.value)} className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-sand-600 outline-none" placeholder="Type your full legal name and today's date" />
                        </div>
                    </div>

                    <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 mt-8">
                        <h4 className="font-bold text-brown-900 mb-2">Notice: Refundable Deposit</h4>
                        <p className="text-brown-800 text-sm">
                            By submitting this application, your request will be reviewed. <strong>Please contact support to proceed with the payment of the refundable deposit</strong> of <span className="font-bold">${puppy.deposit_amount}</span> to secure {puppy.name}. You will receive a notification upon approval.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-sand-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-sand-500 transition-colors disabled:opacity-50 text-lg shadow-sm"
                    >
                        {submitting ? "Submitting Request..." : `Submit Application`}
                    </button>
                </form>
            </div>
        </div>
    );
}
