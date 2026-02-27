"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/supabase/context";
import { Send, UserCircle2, Trash2 } from "lucide-react";

export default function AdminChat() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const deleteConversation = async (e: React.MouseEvent, convId: string, email: string) => {
        e.stopPropagation(); // Don't select the chat when deleting
        if (!confirm(`Are you sure you want to delete the chat with ${email}? This will delete all messages in this thread.`)) return;

        try {
            const { error } = await supabase
                .from("conversations")
                .delete()
                .eq("id", convId);

            if (error) throw error;

            if (activeConvId === convId) setActiveConvId(null);
            setConversations(conversations.filter(c => c.id !== convId));
        } catch (error) {
            console.error("Error deleting conversation:", error);
            alert("Failed to delete chat.");
        }
    };

    // Fetch all conversations with joined user info
    useEffect(() => {
        const fetchConversations = async () => {
            const { data, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    users!conversations_user_id_fkey (
                        email
                    )
                `)
                .order("last_message_at", { ascending: false });

            if (!error && data) {
                // Map the joined email to a flat property for easier UI usage
                const flattened = data.map((c: any) => ({
                    ...c,
                    user_email: c.users?.email || "Unknown User"
                }));
                setConversations(flattened);
            } else if (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();

        const subscription = supabase
            .channel('public:conversations_admin')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'conversations'
            }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setConversations(prev => [payload.new, ...prev]);
                    fetchConversations(); // Still fetch to get joined user info
                } else if (payload.eventType === 'UPDATE') {
                    setConversations(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
                } else if (payload.eventType === 'DELETE') {
                    setConversations(prev => prev.filter(c => c.id === payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // Fetch messages for active conversation
    useEffect(() => {
        if (!activeConvId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", activeConvId)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setMessages(data);
            }
        };

        fetchMessages();

        const subscription = supabase
            .channel(`public:messages_admin:${activeConvId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConvId}`
            }, (payload) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [activeConvId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvId || !user) return;

        const msgText = newMessage.trim();
        setNewMessage("");

        try {
            const { error: msgError } = await supabase.from("messages").insert({
                conversation_id: activeConvId,
                sender_id: user.id, // Admin's UID
                text: msgText
            });

            if (msgError) throw msgError;

            // Update conversation last_message_at
            const { error: convError } = await supabase.from("conversations")
                .update({
                    last_message: msgText,
                    last_message_at: new Date().toISOString()
                })
                .eq("id", activeConvId);

            if (convError) {
                console.warn("Could not update conversation timestamp, but message was sent:", convError);
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            alert("Failed to send message: " + (error.message || "Unknown error"));
        }
    };

    const activeConv = conversations.find(c => c.id === activeConvId);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-cream-200 overflow-hidden h-[calc(100vh-140px)] flex flex-col md:flex-row">
            {/* Sidebar - Conversation List */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-cream-200 flex flex-col bg-cream-50 h-1/3 md:h-full shrink-0">
                <div className="p-4 md:p-6 border-b border-cream-200 bg-white">
                    <h2 className="text-xl font-extrabold text-brown-900">Active Chats</h2>
                    <p className="text-brown-800 text-xs mt-1">Select a user to start replying.</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-6 text-center text-brown-800 text-sm">No active conversations.</div>
                    ) : (
                        <ul className="divide-y divide-cream-200">
                            {conversations.map(conv => (
                                <li key={conv.id} className="relative group">
                                    <button
                                        onClick={() => setActiveConvId(conv.id)}
                                        className={`w-full text-left p-4 pr-12 flex items-center gap-3 transition-colors ${activeConvId === conv.id ? 'bg-cream-200' : 'hover:bg-cream-100'}`}
                                    >
                                        <UserCircle2 className="h-10 w-10 text-sand-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-brown-900 truncate">{conv.user_email || 'Unknown User'}</p>
                                            <p className="text-xs text-brown-800 mt-0.5 truncate">
                                                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => deleteConversation(e, conv.id, conv.user_email)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brown-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Chat"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white h-2/3 md:h-full">
                {activeConvId ? (
                    <>
                        <div className="p-4 md:p-6 border-b border-cream-200 bg-white shadow-sm z-10">
                            <h2 className="text-lg font-bold text-brown-900 flex items-center gap-2">
                                <UserCircle2 className="h-6 w-6 text-sand-500" />
                                <span className="truncate">{activeConv?.user_email}</span>
                            </h2>
                        </div>

                        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-cream-50 flex flex-col gap-4">
                            {messages.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-brown-800 opacity-70 italic text-center text-sm px-10">
                                    No messages in this conversation yet.
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isAdmin = msg.sender_id === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isAdmin ? 'bg-sand-500 text-white rounded-tr-sm' : 'bg-white text-brown-900 border border-cream-200 rounded-tl-sm'}`}>
                                                <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                                                <span className={`text-[10px] block mt-1 ${isAdmin ? 'text-white/70 text-right' : 'text-brown-800/60'}`}>
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 md:p-4 bg-white border-t border-cream-200">
                            <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 md:px-5 py-3 md:py-4 bg-cream-50 border border-cream-200 rounded-full focus:ring-2 focus:ring-sand-600 focus:border-sand-600 outline-none text-brown-900"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-sand-600 text-white p-3 md:p-4 rounded-full hover:bg-sand-500 transition-colors disabled:opacity-50 disabled:hover:bg-sand-600 flex-shrink-0 shadow-sm"
                                >
                                    <Send className="h-5 w-5 -ml-0.5 md:-ml-1 mt-0.5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-brown-800 bg-cream-50">
                        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm text-center max-w-sm">
                            <UserCircle2 className="h-12 w-12 text-sand-500 mx-auto mb-3" />
                            <p className="font-bold text-brown-900">No Chat Selected</p>
                            <p className="text-sm mt-1">Select a conversation from the sidebar to view messages and reply.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
