"use client";

import { supabase } from "./config";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        return registration;
    } catch (error) {
        console.error("Service worker registration failed:", error);
    }
}

export async function subscribeUserToPush(userId: string) {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!publicVapidKey) {
            console.error("VAPID public key is missing");
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // Save subscription to Supabase
        const { error } = await supabase.from("push_subscriptions").insert({
            user_id: userId,
            subscription: subscription.toJSON(),
        });

        if (error) {
            console.error("Failed to save push subscription:", error);
        } else {
            console.log("Successfully subscribed to push notifications");
        }
    } catch (error) {
        console.error("Failed to subscribe user to push:", error);
    }
}

export async function sendPushNotification(userId: string, title: string, body: string, url: string) {
    try {
        const response = await fetch("/api/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, title, body, url }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to send push notification");
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling push API:", error);
    }
}

export async function notifyAdmins(title: string, body: string, url: string) {
    try {
        // Fetch all admins
        const { data: admins, error } = await supabase
            .from("users")
            .select("id")
            .eq("role", "admin");

        if (error) throw error;

        if (admins) {
            const notifications = admins.map(admin =>
                sendPushNotification(admin.id, title, body, url)
            );
            await Promise.all(notifications);
        }
    } catch (error) {
        console.error("Error notifying admins:", error);
    }
}
