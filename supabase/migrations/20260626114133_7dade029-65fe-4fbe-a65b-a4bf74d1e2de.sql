CREATE TABLE public.app_visitors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_key text NOT NULL,
  user_agent text,
  path text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.app_visitors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_visitors TO authenticated;
GRANT ALL ON public.app_visitors TO service_role;
ALTER TABLE public.app_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert visitors" ON public.app_visitors FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public read visitors" ON public.app_visitors FOR SELECT TO public USING (true);
CREATE INDEX idx_app_visitors_created_at ON public.app_visitors(created_at DESC);
CREATE INDEX idx_app_visitors_key ON public.app_visitors(visitor_key);