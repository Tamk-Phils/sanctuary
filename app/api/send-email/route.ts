import { Resend } from "resend";
import { NextResponse } from "next/server";

const adminEmail = "admin@elliesbichonsanctuary.com"; // Professional email

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Email server not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const body = await req.json();
        const { type } = body;

        if (type === "contact") {
            const { name, email, subject, message } = body;

            // Send to Admin
            await resend.emails.send({
                from: "Ellie's Sanctuary <notifications@elliesbichonsanctuary.com>",
                to: adminEmail,
                subject: `Contact Form: ${subject}`,
                replyTo: email,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4a3728;">New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <hr />
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                `,
            });

            return NextResponse.json({ success: true });
        }

        if (type === "adoption_request") {
            const { userEmail, userName, puppyName, depositAmount } = body;

            // 1. Send Confirmation to User
            await resend.emails.send({
                from: "Ellie's Sanctuary <hello@elliesbichonsanctuary.com>",
                to: userEmail,
                subject: `Application Received: ${puppyName}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                        <h2 style="color: #4a3728;">Thank you, ${userName}!</h2>
                        <p>We've received your application to adopt <strong>${puppyName}</strong>.</p>
                        <p>Our team will review your application shortly. In the meantime, please contact support to proceed with the refundable deposit of **$${depositAmount}**.</p>
                        <p>Stay tuned for updates!</p>
                        <br />
                        <p>Best regards,<br />The Ellie's Sanctuary Team</p>
                    </div>
                `,
            });

            // 2. Send Alert to Admin
            await resend.emails.send({
                from: "Ellie's Sanctuary <notifications@elliesbichonsanctuary.com>",
                to: adminEmail,
                subject: `New Adoption Request: ${puppyName}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4a3728;">New Adoption Request</h2>
                        <p><strong>Applicant:</strong> ${userName} (${userEmail})</p>
                        <p><strong>Puppy:</strong> ${puppyName}</p>
                        <p><strong>Deposit:</strong> $${depositAmount}</p>
                        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://elliesbichonsanctuary.com'}/admin/requests" style="background: #a89078; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Request in Admin Portal</a></p>
                    </div>
                `,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    } catch (error: any) {
        console.error("Email API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
