-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Puppies Table
CREATE TABLE IF NOT EXISTS public.puppies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    adoption_fee NUMERIC NOT NULL,
    deposit_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'available',
    puppy_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Adoption Requests Table
CREATE TABLE IF NOT EXISTS public.adoption_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    puppy_id UUID REFERENCES public.puppies(id) ON DELETE CASCADE,
    puppy_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    deposit_amount NUMERIC NOT NULL,
    agreed_to_terms BOOLEAN NOT NULL,
    application_data JSONB DEFAULT '{}'::jsonb, -- Flexible storage for all form fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all new Phase 2 columns exist safely (Now primarily using application_data)
ALTER TABLE public.adoption_requests ADD COLUMN IF NOT EXISTS application_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.adoption_requests ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.adoption_requests ADD COLUMN IF NOT EXISTS contact_method TEXT;
ALTER TABLE public.adoption_requests ADD COLUMN IF NOT EXISTS adoption_reason TEXT;


-- 3.5 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Ensure all Chat Columns exist (Augmentation)
ALTER TABLE public.conversations 
    ADD COLUMN IF NOT EXISTS user_email TEXT,
    ADD COLUMN IF NOT EXISTS last_message TEXT,
    ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.messages 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 10. DEFAULT POLICIES (Test Mode Equivalent)
-- In a real production app, limit these, but this mimics our Firestore Test Mode behavior

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.users;
CREATE POLICY "Enable all access for everyone" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.puppies;
CREATE POLICY "Enable all access for everyone" ON public.puppies FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.adoption_requests;
CREATE POLICY "Enable all access for everyone" ON public.adoption_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.conversations;
CREATE POLICY "Enable all access for everyone" ON public.conversations FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.messages;
CREATE POLICY "Enable all access for everyone" ON public.messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.notifications;
CREATE POLICY "Enable all access for everyone" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for everyone" ON public.push_subscriptions;
CREATE POLICY "Enable all access for everyone" ON public.push_subscriptions FOR ALL USING (true);

-- 11. ENABLE REALTIME
-- This allows the app to listen for changes automatically
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'adoption_requests') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.adoption_requests;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'push_subscriptions') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.push_subscriptions;
    END IF;
END $$;
