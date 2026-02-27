export default function FAQPage() {
    const faqs = [
        {
            q: "Do you ship internationally?",
            a: "Yes! Currently, we offer specialized ground and flight nanny transportation across the USA, Canada, and Australia to ensure your puppy arrives safely."
        },
        {
            q: "Are the puppies vaccinated?",
            a: "Absolutely. All puppies receive their first round of shots, multiple rounds of dewormings, and a comprehensive vet check before leaving."
        },
        {
            q: "What is your refund policy?",
            a: "Deposits are generally non-refundable unless the puppy fails its final vet check or we are unable to fulfill your adoption for unforeseen reasons."
        },
        {
            q: "Can I choose my puppy's name?",
            a: "Yes! While we give them temporary names for identification, you are welcome to pick their forever name once your adoption request is approved."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brown-900 tracking-tight">Frequently Asked Questions</h1>
                <p className="mt-4 text-xl text-brown-800">
                    Everything you need to know about our sanctuary and adoption process.
                </p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200">
                        <h3 className="text-xl font-bold text-brown-900 mb-3">{faq.q}</h3>
                        <p className="text-brown-800">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
