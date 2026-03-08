import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Heart } from "lucide-react";
import categoryResin from "@/assets/category-resin.jpg";
import categoryHomeDecor from "@/assets/category-homedecor.jpg";
import categoryTextile from "@/assets/category-textile.jpg";
import categoryGifts from "@/assets/category-gifts.jpg";

const categoryData: Record<string, {
  title: string;
  image: string;
  products: { name: string; price: number; seller: string; rating: number; description: string; slug: string }[];
}> = {
  resin: {
    title: "Resin Products",
    image: categoryResin,
    products: [
      { name: "Resin Photo Frames", price: 599, seller: "Priya Crafts", rating: 4.8, description: "Preserve memories in stunning handcrafted resin frames with flowers & glitter.", slug: "resin-photo-frames" },
      { name: "Resin Coasters", price: 699, seller: "CraftNest", rating: 4.9, description: "Beautiful ocean-wave and floral coaster sets for your living space.", slug: "resin-coasters" },
      { name: "Resin Bookmarks", price: 249, seller: "ArtByMeera", rating: 4.6, description: "Elegant pressed-flower bookmarks handcrafted with love.", slug: "resin-bookmarks" },
      { name: "Resin Varmala Preservation", price: 1499, seller: "KeepSakeArt", rating: 4.9, description: "Preserve your wedding varmala in a beautiful resin frame forever.", slug: "resin-varmala" },
      { name: "Resin Earrings", price: 349, seller: "StarResin", rating: 4.7, description: "Lightweight floral and glitter resin earrings for everyday elegance.", slug: "resin-earrings" },
      { name: "Resin Pendants", price: 399, seller: "ArtByMeera", rating: 4.6, description: "Unique handmade resin pendants with real dried flowers inside.", slug: "resin-pendants" },
      { name: "Resin Name Keychains", price: 299, seller: "Priya Crafts", rating: 4.8, description: "Personalized resin keychains with custom names and colors.", slug: "resin-keychains" },
      { name: "Resin Jewelry Set", price: 899, seller: "StarResin", rating: 4.5, description: "Matching necklace, earrings & ring set in handcrafted resin.", slug: "resin-jewelry" },
      { name: "Resin Table Decor", price: 1199, seller: "CraftNest", rating: 4.8, description: "Statement table pieces with ocean, galaxy & floral resin art.", slug: "resin-table-decor" },
      { name: "Resin Hair Accessories", price: 449, seller: "StarResin", rating: 4.6, description: "Resin hair clips and pins with embedded flowers and sparkle.", slug: "resin-hair-accessories" },
      { name: "Resin Wall Art", price: 1999, seller: "KeepSakeArt", rating: 4.9, description: "Large resin art panels with ocean waves and abstract designs.", slug: "resin-wall-art" },
      { name: "Resin Phone Covers", price: 549, seller: "CraftNest", rating: 4.5, description: "Custom resin phone cases with personalized designs.", slug: "resin-phone-covers" },
      { name: "Resin Gift Sets", price: 999, seller: "Priya Crafts", rating: 4.7, description: "Curated resin gift boxes perfect for any occasion.", slug: "resin-gift-sets" },
    ],
  },
  homedecor: {
    title: "Home Decor",
    image: categoryHomeDecor,
    products: [
      { name: "Macrame Wall Hanging", price: 899, seller: "KnottyVibes", rating: 4.7, description: "Bohemian macrame wall art for cozy interiors.", slug: "macrame-wall" },
      { name: "Ceramic Planter", price: 549, seller: "EarthTones", rating: 4.8, description: "Hand-painted ceramic planters for your indoor garden.", slug: "ceramic-planter" },
      { name: "Woven Basket Set", price: 1199, seller: "WeaveArt", rating: 4.6, description: "Natural fiber woven baskets for storage and decor.", slug: "woven-basket" },
      { name: "Handpainted Lamp", price: 1499, seller: "LightCraft", rating: 4.9, description: "Artisan hand-painted lamps to brighten your space.", slug: "handpainted-lamp" },
    ],
  },
  textile: {
    title: "Textile",
    image: categoryTextile,
    products: [
      { name: "Embroidered Scarf", price: 599, seller: "ThreadWorks", rating: 4.7, description: "Hand-embroidered scarves with intricate patterns.", slug: "embroidered-scarf" },
      { name: "Block Print Tote", price: 449, seller: "PrintCraft", rating: 4.5, description: "Eco-friendly block-printed tote bags.", slug: "block-print-tote" },
      { name: "Handwoven Stole", price: 999, seller: "LoomArt", rating: 4.8, description: "Soft handwoven stoles in natural fabrics.", slug: "handwoven-stole" },
      { name: "Crochet Top", price: 799, seller: "HookStyle", rating: 4.6, description: "Trendy crochet tops handmade with love.", slug: "crochet-top" },
    ],
  },
  gifts: {
    title: "Gift Products",
    image: categoryGifts,
    products: [
      { name: "Custom Gift Box", price: 499, seller: "WrapJoy", rating: 4.9, description: "Curated gift boxes for any celebration.", slug: "custom-gift-box" },
      { name: "Personalized Mug", price: 349, seller: "PrintHouse", rating: 4.5, description: "Custom mugs with names, quotes or photos.", slug: "personalized-mug" },
      { name: "Memory Scrapbook", price: 899, seller: "PaperLove", rating: 4.8, description: "Handmade scrapbooks to preserve precious memories.", slug: "memory-scrapbook" },
      { name: "Candle Gift Set", price: 649, seller: "WaxCraft", rating: 4.7, description: "Artisan scented candle sets in beautiful packaging.", slug: "candle-gift-set" },
    ],
  },
};

export { categoryData };

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const data = categoryData[category || "resin"];

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/customer")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">{data.title}</h1>
      </header>

      <div className="px-4 pb-4">
        <img src={data.image} alt={data.title} className="w-full h-36 object-cover rounded-xl" />
      </div>

      <section className="px-4 pb-8 grid grid-cols-2 gap-3">
        {data.products.map((p, i) => (
          <button
            key={i}
            onClick={() => navigate(`/customer/${category}/${p.slug}`)}
            className="craft-card overflow-hidden text-left"
          >
            <div className="h-28 bg-muted relative">
              <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </span>
            </div>
            <div className="p-3">
              <h4 className="font-body font-semibold text-foreground text-xs truncate">{p.name}</h4>
              <p className="text-[10px] text-muted-foreground font-body line-clamp-2 mt-0.5">{p.description}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-bold text-primary font-body">₹{p.price}</span>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-body">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  {p.rating}
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default CategoryPage;
