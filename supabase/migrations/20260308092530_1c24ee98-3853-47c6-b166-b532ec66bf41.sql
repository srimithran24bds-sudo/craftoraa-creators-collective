
-- Sellers table for registered artisans
CREATE TABLE public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  craft_type TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  contact TEXT NOT NULL,
  location TEXT NOT NULL,
  social_media TEXT,
  plan TEXT NOT NULL DEFAULT 'Starter',
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  design_style TEXT,
  wish_description TEXT,
  reference_image TEXT,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order notifications sent to matched sellers
CREATE TABLE public.order_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  seller_note TEXT,
  match_reason TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disable RLS since no auth for now
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notifications ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth for now)
CREATE POLICY "Public read sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Public insert sellers" ON public.sellers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update sellers" ON public.sellers FOR UPDATE USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public read notifications" ON public.order_notifications FOR SELECT USING (true);
CREATE POLICY "Public insert notifications" ON public.order_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update notifications" ON public.order_notifications FOR UPDATE USING (true);

-- Enable realtime for order notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_notifications;
