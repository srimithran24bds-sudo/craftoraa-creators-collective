import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image_url: string | null;
  seller_name: string;
}

const categoryOptions = [
  { value: "resin", label: "Resin" },
  { value: "homedecor", label: "Home Decor" },
  { value: "textile", label: "Textile" },
  { value: "gifts", label: "Gifts" },
];

// Compress image to ~600px wide JPEG so it fits comfortably in a text column
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 800;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const SellerProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "resin",
    description: "",
    sellerName: localStorage.getItem("craftora_seller_name") || "",
    imageDataUrl: "" as string,
  });

  const load = async () => {
    const { data } = await supabase
      .from("seller_products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data || []) as Product[]);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("seller-products-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seller_products" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use an image under 8 MB.", variant: "destructive" });
      return;
    }
    try {
      const dataUrl = await compressImage(file);
      setForm((p) => ({ ...p, imageDataUrl: dataUrl }));
    } catch {
      toast({ title: "Could not read image", variant: "destructive" });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast({ title: "Missing fields", description: "Name, price and category are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const sellerName = form.sellerName.trim() || "Craftora Seller";
    localStorage.setItem("craftora_seller_name", sellerName);
    const { error } = await supabase.from("seller_products").insert({
      name: form.name.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      description: form.description.trim() || null,
      image_url: form.imageDataUrl || null,
      seller_name: sellerName,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not add product", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product listed ✨", description: `${form.name} is now live on the customer ${form.category} page.` });
    setForm({ name: "", price: "", category: form.category, description: "", sellerName, imageDataUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground flex-1">My Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="w-9 h-9 rounded-full gradient-warm flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </header>

      {showForm && (
        <section className="px-4 pb-4 animate-fade-up">
          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Add New Product</h3>
            <input
              placeholder="Your name / business name"
              value={form.sellerName}
              onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <input
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <input
              placeholder="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none"
            >
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none resize-none"
            />
            <label className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs font-body">
                {form.imageDataUrl ? "Image ready — tap to replace" : "Upload product image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {form.imageDataUrl && (
              <img src={form.imageDataUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-2.5 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Publishing..." : "Add Product"}
            </button>
          </div>
        </section>
      )}

      <section className="px-4 pb-8 space-y-3">
        {products.length === 0 && (
          <p className="text-center text-xs text-muted-foreground font-body py-8">
            No products yet. Tap + to list your first handmade piece.
          </p>
        )}
        {products.map((p) => (
          <div key={p.id} className="craft-card p-4 flex gap-3">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-foreground text-sm truncate">{p.name}</h4>
              <p className="text-xs text-muted-foreground font-body capitalize">{p.category} · {p.seller_name}</p>
              <p className="text-sm font-semibold text-primary font-body mt-1">₹{p.price}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default SellerProducts;
