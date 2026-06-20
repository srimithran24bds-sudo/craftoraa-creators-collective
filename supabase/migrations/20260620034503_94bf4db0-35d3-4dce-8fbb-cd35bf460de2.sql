
CREATE TABLE public.seller_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid,
  seller_name text NOT NULL DEFAULT 'Craftora Seller',
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_products TO anon, authenticated;
GRANT ALL ON public.seller_products TO service_role;

ALTER TABLE public.seller_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read seller_products" ON public.seller_products FOR SELECT USING (true);
CREATE POLICY "Public insert seller_products" ON public.seller_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update seller_products" ON public.seller_products FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_products;

-- Storage policies for the seller-products bucket (private bucket, but allow public read + upload)
CREATE POLICY "Public read seller-products objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'seller-products');

CREATE POLICY "Public upload seller-products objects"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'seller-products');
