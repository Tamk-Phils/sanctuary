"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/supabase/context";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

function ChatContent() {
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/login?redirect=/chat");
            return;
        }

        let channel: ReturnType<typeof supabase.channel> | null = null;
        let fetchMessages: (() => void) | null = null;

        const initChat = async () => {
            try {
                // Find existing conversation
                const { data: convData, error: convError } = await supabase
                    .from("conversations")
                    .select("id")
                    .eq("user_id", user.id)
                    .limit(1);

                if (convError) throw convError;

                let currentConvId = null;

                if (!convData || convData.length === 0) {
                    // Create new conversation
                    const { data: newConv, error: createError } = await supabase
                        .from("conversations")
                        .insert({
                            user_id: user.id
                        })
                        .select("id")
                        .single();

                    if (createError) throw createError;
                    currentConvId = newConv.id;
                } else {
                    currentConvId = convData[0].id;
                }

                setConversationId(currentConvId);

                if (currentConvId) {
                    fetchMessages = async () => {
                        const { data: msgs, error: msgError } = await supabase
                            .from("messages")
                            .select("*")
                            .eq("conversation_id", currentConvId)
                            .order("created_at", { ascending: true });

                        if (!msgError && msgs) {
                            setMessages(msgs);
                            setLoading(false);

                            const aboutPup = searchParams.get("about");
                            if (aboutPup && msgs.length === 0) {
                                setNewMessage(`Hi Ellie, I'm interested in the puppy with ID: ${aboutPup}!`);
                            }
                        }
                    };

                    await fetchMessages();

                    channel = supabase
                        .channel(`public:messages:${currentConvId}`)
                        .on('postgres_changes', {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'messages',
                            filter: `conversation_id=eq.${currentConvId}`
                        }, (payload) => {
                            setMessages(prev => {
                                // Prevent duplicates
                                if (prev.some(m => m.id === payload.new.id)) return prev;
                                return [...prev, payload.new];
                            });
                        })
                        .subscribe();
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
                setLoading(false);
            }
        };

        initChat();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [user, authLoading, router, searchParams]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId || !user) return;

        const msgText = newMessage.trim();
        setNewMessage("");

        try {
            const { error: msgError } = await supabase.from("messages").insert({
                conversation_id: conversationId,
                sender_id: user.id,
                text: msgText
            });

            if (msgError) throw msgError;

            // Update conversation last_updated/message_at
            const { error: convError } = await supabase.from("conversations")
                .update({
                    last_message: msgText,
                    last_message_at: new Date().toISOString()
                })
                .eq("id", conversationId);

            if (convError) {
                console.warn("Could not update conversation timestamp, but message was sent:", convError);
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            alert("Failed to send message: " + (error.message || "Unknown error"));
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[80vh] flex flex-col">
            <div className="bg-white flex-1 rounded-3xl shadow-sm border border-cream-200 flex flex-col overflow-hidden">
                <div className="bg-cream-100 p-6 border-b border-cream-200 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-brown-900 border-b-2 border-sand-600 inline-block pb-1">Chat with Ellie</h1>
                        <p className="text-brown-800 text-sm mt-1">We usually reply within a few hours.</p>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-cream-50 flex flex-col gap-4">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-brown-800 opacity-70 italic text-center px-4">
                            Send a message to start the conversation. Feel free to ask about our adoption process, specific puppies, or transportation!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.sender_id === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMine ? 'bg-sand-500 text-white rounded-tr-sm' : 'bg-white text-brown-900 border border-cream-200 rounded-tl-sm'}`}>
                                        <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                                        <span className={`text-[10px] block mt-1 ${isMine ? 'text-white/70 text-right' : 'text-brown-800/60'}`}>
                                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-cream-200">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-5 py-4 bg-cream-50 border border-cream-200 rounded-full focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none text-brown-900"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-sand-600 text-white p-4 rounded-full hover:bg-sand-500 transition-colors disabled:opacity-50 disabled:hover:bg-sand-600 flex-shrink-0 shadow-sm"
                        >
                            <Send className="h-5 w-5 -ml-1 mt-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-[70vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-600"></div></div>}>
            <ChatContent />
        </Suspense>
    )
}
