CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  attending boolean NOT NULL,
  guests integer NOT NULL DEFAULT 1 CHECK (guests BETWEEN 0 AND 20),
  events text[] NOT NULL DEFAULT '{}',
  message text CHECK (message IS NULL OR char_length(message) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvps TO anon, authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can send an RSVP" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);