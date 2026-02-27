import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabaseIsConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

const getStorageKey = () => {
    if (typeof window === 'undefined') return 'sb-auth-token';
    // Ensure window.name persists for the session to provide a stable tab identifier
    if (!window.name) {
        window.name = 'tab-' + Math.random().toString(36).substring(2, 9);
    }
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'default';
    return `sb-${projectId}-auth-token-${window.name}`;
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        storageKey: getStorageKey(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
