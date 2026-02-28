import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // We need this to bypass RLS for sending logic if needed

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        "mailto:admin@elliesbichonsanctuary.com",
        vapidPublicKey,
        vapidPrivateKey
    );
}

export async function POST(req: Request) {
    try {
        if (!vapidPublicKey || !vapidPrivateKey) {
            return NextResponse.json({ error: "Push server not configured" }, { status: 500 });
        }

        const { userId, title, body, url } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Use service role client to fetch subscriptions (bypassing RLS)
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: subscriptions, error } = await supabase
            .from("push_subscriptions")
            .select("subscription")
            .eq("user_id", userId);

        if (error) throw error;

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: "No subscriptions found for user" });
        }

        const notifications = subscriptions.map((s) =>
            webpush.sendNotification(
                s.subscription as unknown as webpush.PushSubscription,
                JSON.stringify({ title, body, url })
            ).catch((err: webpush.WebPushError) => {
                console.error("Error sending push notification:", err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription has expired or is no longer valid
                }
            })
        );

        await Promise.all(notifications);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Push API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
