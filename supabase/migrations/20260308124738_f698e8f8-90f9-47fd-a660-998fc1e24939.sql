
CREATE TABLE public.seller_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'suggestion',
  message TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 0,
  logo_file TEXT,
  attachment_file TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert feedback" ON public.seller_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read feedback" ON public.seller_feedback FOR SELECT USING (true);
CREATE POLICY "Public update feedback" ON public.seller_feedback FOR UPDATE USING (true);
