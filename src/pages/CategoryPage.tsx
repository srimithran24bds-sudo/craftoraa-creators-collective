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
      { name: "Handwoven Koodai", price: 799, seller: "WeaveArt", rating: 4.8, description: "Traditional handwoven baskets crafted with vibrant colors and sturdy fibers.", slug: "handwoven-koodai" },
      { name: "Ceramic Bowls", price: 549, seller: "EarthTones", rating: 4.7, description: "Hand-painted ceramic bowls perfect for serving or display.", slug: "ceramic-bowls" },
      { name: "Ceramic Plates", price: 649, seller: "EarthTones", rating: 4.8, description: "Artisan ceramic plates with unique hand-glazed patterns.", slug: "ceramic-plates" },
      { name: "Ceramic Mugs", price: 399, seller: "EarthTones", rating: 4.6, description: "Handcrafted ceramic mugs with artistic designs.", slug: "ceramic-mugs" },
      { name: "Clay Pots", price: 349, seller: "MittiCraft", rating: 4.5, description: "Traditional clay pots for plants and home decor.", slug: "clay-pots" },
      { name: "Terracotta Decor", price: 599, seller: "MittiCraft", rating: 4.7, description: "Beautiful terracotta figurines and decorative items.", slug: "terracotta-decor" },
      { name: "Handmade Lamps", price: 1299, seller: "LightCraft", rating: 4.9, description: "Artisan hand-painted lamps to brighten your space.", slug: "handmade-lamps" },
      { name: "Wooden Lamps", price: 1499, seller: "LightCraft", rating: 4.8, description: "Elegant wooden lamps with warm ambient lighting.", slug: "wooden-lamps" },
      { name: "Decorative Lamps", price: 999, seller: "LightCraft", rating: 4.7, description: "Unique decorative lamps in various artisan styles.", slug: "decorative-lamps" },
      { name: "Wooden Wall Art", price: 1899, seller: "WoodCraft", rating: 4.9, description: "Hand-carved wooden wall art with intricate designs.", slug: "wooden-wall-art" },
      { name: "Wall Hangings", price: 899, seller: "KnottyVibes", rating: 4.7, description: "Bohemian wall hangings for cozy interiors.", slug: "wall-hangings" },
      { name: "Dream Catchers", price: 499, seller: "KnottyVibes", rating: 4.6, description: "Handmade dream catchers with feathers and beads.", slug: "dream-catchers" },
      { name: "Macrame Wall Decor", price: 799, seller: "KnottyVibes", rating: 4.8, description: "Elegant macrame wall hangings in natural cotton.", slug: "macrame-wall-decor" },
      { name: "Handmade Mirrors", price: 1599, seller: "WoodCraft", rating: 4.8, description: "Decorative handcrafted mirrors with artistic frames.", slug: "handmade-mirrors" },
      { name: "Bamboo Crafts", price: 699, seller: "GreenCraft", rating: 4.6, description: "Eco-friendly bamboo craft items for sustainable living.", slug: "bamboo-crafts" },
      { name: "Cane Furniture", price: 3499, seller: "GreenCraft", rating: 4.7, description: "Traditional cane furniture pieces with modern aesthetics.", slug: "cane-furniture" },
      { name: "Brass Decor Items", price: 1199, seller: "MetalArt", rating: 4.8, description: "Exquisite brass figurines and decorative accents.", slug: "brass-decor" },
      { name: "Metal Decor Items", price: 999, seller: "MetalArt", rating: 4.7, description: "Handcrafted metal art pieces for walls and shelves.", slug: "metal-decor" },
      { name: "Table Decor Pieces", price: 749, seller: "EarthTones", rating: 4.6, description: "Curated table centerpieces and decorative accessories.", slug: "table-decor" },
      { name: "Indoor Plant Holders", price: 599, seller: "GreenCraft", rating: 4.7, description: "Stylish handmade holders for your indoor plants.", slug: "plant-holders" },
      { name: "Candle Holders", price: 449, seller: "MetalArt", rating: 4.6, description: "Handmade candle holders in brass, wood & ceramic.", slug: "candle-holders" },
      { name: "Clay Sculptures", price: 1299, seller: "MittiCraft", rating: 4.8, description: "Artistic clay sculptures handcrafted by local artisans.", slug: "clay-sculptures" },
      { name: "Decorative Trays", price: 899, seller: "WoodCraft", rating: 4.7, description: "Aesthetic hand-painted trays for serving and display.", slug: "decorative-trays" },
      { name: "Mini Decor Statues", price: 549, seller: "MittiCraft", rating: 4.5, description: "Small handmade statues for shelves and tabletops.", slug: "mini-statues" },
    ],
  },
  textile: {
    title: "Textile",
    image: categoryTextile,
    products: [
      { name: "Cotton Sarees", price: 1999, seller: "LoomArt", rating: 4.9, description: "Handwoven pure cotton sarees with traditional motifs.", slug: "cotton-sarees" },
      { name: "Silk Sarees", price: 4999, seller: "SilkWeave", rating: 4.9, description: "Luxurious handloom silk sarees with rich zari work.", slug: "silk-sarees" },
      { name: "Handloom Sarees", price: 2499, seller: "LoomArt", rating: 4.8, description: "Authentic handloom sarees from traditional weavers.", slug: "handloom-sarees" },
      { name: "Shawls", price: 1299, seller: "ThreadWorks", rating: 4.7, description: "Warm handwoven shawls in wool and pashmina blends.", slug: "shawls" },
      { name: "Scarves", price: 599, seller: "ThreadWorks", rating: 4.6, description: "Hand-embroidered scarves with intricate patterns.", slug: "scarves" },
      { name: "Dupattas", price: 799, seller: "PrintCraft", rating: 4.7, description: "Block-printed and hand-dyed dupattas in vibrant colors.", slug: "dupattas" },
      { name: "Cushion Covers", price: 449, seller: "StitchArt", rating: 4.6, description: "Embroidered and printed cushion covers for home decor.", slug: "cushion-covers" },
      { name: "Curtains", price: 1499, seller: "StitchArt", rating: 4.7, description: "Handwoven and block-printed curtains for elegant interiors.", slug: "curtains" },
      { name: "Table Runners", price: 699, seller: "StitchArt", rating: 4.5, description: "Beautifully crafted table runners with traditional designs.", slug: "table-runners" },
      { name: "Bed Sheets", price: 1799, seller: "LoomArt", rating: 4.8, description: "Premium handloom bed sheets with natural dyes.", slug: "bed-sheets" },
      { name: "Khadi Fabrics", price: 899, seller: "KhadiCraft", rating: 4.7, description: "Authentic hand-spun khadi fabric by the meter.", slug: "khadi-fabrics" },
      { name: "Linen Fabrics", price: 1099, seller: "LoomArt", rating: 4.6, description: "Premium quality handloom linen fabric for garments.", slug: "linen-fabrics" },
      { name: "Embroidered Dresses", price: 2499, seller: "ThreadWorks", rating: 4.8, description: "Hand-embroidered dresses with intricate needlework.", slug: "embroidered-dresses" },
      { name: "Handloom Garments", price: 1999, seller: "KhadiCraft", rating: 4.7, description: "Ready-to-wear garments from handloom fabrics.", slug: "handloom-garments" },
      { name: "Handmade Bags", price: 899, seller: "PrintCraft", rating: 4.6, description: "Eco-friendly handmade textile bags with block prints.", slug: "handmade-bags" },
      { name: "Textile Wall Art", price: 1299, seller: "StitchArt", rating: 4.8, description: "Fabric-based wall art with embroidery and applique.", slug: "textile-wall-art" },
      { name: "Crochet Tops", price: 799, seller: "HookStyle", rating: 4.6, description: "Trendy crochet tops handmade with love.", slug: "crochet-tops" },
      { name: "Wool Fabrics", price: 1199, seller: "ThreadWorks", rating: 4.5, description: "Hand-spun wool fabrics for winter wear and crafts.", slug: "wool-fabrics" },
      { name: "Designer Fabrics", price: 1499, seller: "SilkWeave", rating: 4.7, description: "Exclusive designer fabrics for custom tailoring.", slug: "designer-fabrics" },
      { name: "Printed Fabrics", price: 699, seller: "PrintCraft", rating: 4.6, description: "Hand block-printed fabrics in traditional patterns.", slug: "printed-fabrics" },
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
