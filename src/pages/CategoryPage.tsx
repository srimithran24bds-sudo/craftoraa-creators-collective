import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Heart, Palette, Sparkles } from "lucide-react";
import categoryResin from "@/assets/category-resin.jpg";
import categoryHomeDecor from "@/assets/category-homedecor.jpg";
import categoryTextile from "@/assets/category-textile.jpg";
import categoryGifts from "@/assets/category-gifts.jpg";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const categoryData: Record<string, {
  title: string;
  image: string;
  products: { name: string; price: number; seller: string; rating: number; description: string; slug: string; image: string }[];
}> = {
  resin: {
    title: "Resin Products",
    image: categoryResin,
    products: [
      { name: "Resin Photo Frames", price: 599, seller: "Priya Crafts", rating: 4.8, description: "Preserve memories in stunning handcrafted resin frames with flowers & glitter.", slug: "resin-photo-frames", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
      { name: "Resin Coasters", price: 699, seller: "CraftNest", rating: 4.9, description: "Beautiful ocean-wave and floral coaster sets for your living space.", slug: "resin-coasters", image: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=300&fit=crop" },
      { name: "Resin Bookmarks", price: 249, seller: "ArtByMeera", rating: 4.6, description: "Elegant pressed-flower bookmarks handcrafted with love.", slug: "resin-bookmarks", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop" },
      { name: "Resin Varmala Preservation", price: 1499, seller: "KeepSakeArt", rating: 4.9, description: "Preserve your wedding varmala in a beautiful resin frame forever.", slug: "resin-varmala", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" },
      { name: "Resin Earrings", price: 349, seller: "StarResin", rating: 4.7, description: "Lightweight floral and glitter resin earrings for everyday elegance.", slug: "resin-earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop" },
      { name: "Resin Pendants", price: 399, seller: "ArtByMeera", rating: 4.6, description: "Unique handmade resin pendants with real dried flowers inside.", slug: "resin-pendants", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop" },
      { name: "Resin Name Keychains", price: 299, seller: "Priya Crafts", rating: 4.8, description: "Personalized resin keychains with custom names and colors.", slug: "resin-keychains", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=300&fit=crop" },
      { name: "Resin Jewelry Set", price: 899, seller: "StarResin", rating: 4.5, description: "Matching necklace, earrings & ring set in handcrafted resin.", slug: "resin-jewelry", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=400&h=300&fit=crop" },
      { name: "Resin Table Decor", price: 1199, seller: "CraftNest", rating: 4.8, description: "Statement table pieces with ocean, galaxy & floral resin art.", slug: "resin-table-decor", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=300&fit=crop" },
      { name: "Resin Hair Accessories", price: 449, seller: "StarResin", rating: 4.6, description: "Resin hair clips and pins with embedded flowers and sparkle.", slug: "resin-hair-accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop" },
      { name: "Resin Wall Art", price: 1999, seller: "KeepSakeArt", rating: 4.9, description: "Large resin art panels with ocean waves and abstract designs.", slug: "resin-wall-art", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop" },
      { name: "Resin Phone Covers", price: 549, seller: "CraftNest", rating: 4.5, description: "Custom resin phone cases with personalized designs.", slug: "resin-phone-covers", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop" },
      { name: "Resin Gift Sets", price: 999, seller: "Priya Crafts", rating: 4.7, description: "Curated resin gift boxes perfect for any occasion.", slug: "resin-gift-sets", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
    ],
  },
  homedecor: {
    title: "Home Decor",
    image: categoryHomeDecor,
    products: [
      { name: "Handwoven Koodai", price: 799, seller: "WeaveArt", rating: 4.8, description: "Traditional handwoven baskets crafted with vibrant colors and sturdy fibers.", slug: "handwoven-koodai", image: "https://images.unsplash.com/photo-1595408076683-5d0e1bf4096b?w=400&h=300&fit=crop" },
      { name: "Ceramic Bowls", price: 549, seller: "EarthTones", rating: 4.7, description: "Hand-painted ceramic bowls perfect for serving or display.", slug: "ceramic-bowls", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop" },
      { name: "Ceramic Plates", price: 649, seller: "EarthTones", rating: 4.8, description: "Artisan ceramic plates with unique hand-glazed patterns.", slug: "ceramic-plates", image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&h=300&fit=crop" },
      { name: "Ceramic Mugs", price: 399, seller: "EarthTones", rating: 4.6, description: "Handcrafted ceramic mugs with artistic designs.", slug: "ceramic-mugs", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" },
      { name: "Clay Pots", price: 349, seller: "MittiCraft", rating: 4.5, description: "Traditional clay pots for plants and home decor.", slug: "clay-pots", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop" },
      { name: "Terracotta Decor", price: 599, seller: "MittiCraft", rating: 4.7, description: "Beautiful terracotta figurines and decorative items.", slug: "terracotta-decor", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop" },
      { name: "Handmade Lamps", price: 1299, seller: "LightCraft", rating: 4.9, description: "Artisan hand-painted lamps to brighten your space.", slug: "handmade-lamps", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=300&fit=crop" },
      { name: "Wooden Lamps", price: 1499, seller: "LightCraft", rating: 4.8, description: "Elegant wooden lamps with warm ambient lighting.", slug: "wooden-lamps", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop" },
      { name: "Decorative Lamps", price: 999, seller: "LightCraft", rating: 4.7, description: "Unique decorative lamps in various artisan styles.", slug: "decorative-lamps", image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=300&fit=crop" },
      { name: "Wooden Wall Art", price: 1899, seller: "WoodCraft", rating: 4.9, description: "Hand-carved wooden wall art with intricate designs.", slug: "wooden-wall-art", image: "https://images.unsplash.com/photo-1582643381669-b3f4f1f11a58?w=400&h=300&fit=crop" },
      { name: "Wall Hangings", price: 899, seller: "KnottyVibes", rating: 4.7, description: "Bohemian wall hangings for cozy interiors.", slug: "wall-hangings", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&h=300&fit=crop" },
      { name: "Dream Catchers", price: 499, seller: "KnottyVibes", rating: 4.6, description: "Handmade dream catchers with feathers and beads.", slug: "dream-catchers", image: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=400&h=300&fit=crop" },
      { name: "Macrame Wall Decor", price: 799, seller: "KnottyVibes", rating: 4.8, description: "Elegant macrame wall hangings in natural cotton.", slug: "macrame-wall-decor", image: "https://images.unsplash.com/photo-1622127922040-13cab637ee78?w=400&h=300&fit=crop" },
      { name: "Handmade Mirrors", price: 1599, seller: "WoodCraft", rating: 4.8, description: "Decorative handcrafted mirrors with artistic frames.", slug: "handmade-mirrors", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop" },
      { name: "Bamboo Crafts", price: 699, seller: "GreenCraft", rating: 4.6, description: "Eco-friendly bamboo craft items for sustainable living.", slug: "bamboo-crafts", image: "https://images.unsplash.com/photo-1567225477277-c8162eb4991d?w=400&h=300&fit=crop" },
      { name: "Cane Furniture", price: 3499, seller: "GreenCraft", rating: 4.7, description: "Traditional cane furniture pieces with modern aesthetics.", slug: "cane-furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
      { name: "Brass Decor Items", price: 1199, seller: "MetalArt", rating: 4.8, description: "Exquisite brass figurines and decorative accents.", slug: "brass-decor", image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=400&h=300&fit=crop" },
      { name: "Metal Decor Items", price: 999, seller: "MetalArt", rating: 4.7, description: "Handcrafted metal art pieces for walls and shelves.", slug: "metal-decor", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop" },
      { name: "Table Decor Pieces", price: 749, seller: "EarthTones", rating: 4.6, description: "Curated table centerpieces and decorative accessories.", slug: "table-decor", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=300&fit=crop" },
      { name: "Indoor Plant Holders", price: 599, seller: "GreenCraft", rating: 4.7, description: "Stylish handmade holders for your indoor plants.", slug: "plant-holders", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop" },
      { name: "Candle Holders", price: 449, seller: "MetalArt", rating: 4.6, description: "Handmade candle holders in brass, wood & ceramic.", slug: "candle-holders", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&h=300&fit=crop" },
      { name: "Clay Sculptures", price: 1299, seller: "MittiCraft", rating: 4.8, description: "Artistic clay sculptures handcrafted by local artisans.", slug: "clay-sculptures", image: "https://images.unsplash.com/photo-1544413164-5f1b361f5baf?w=400&h=300&fit=crop" },
      { name: "Decorative Trays", price: 899, seller: "WoodCraft", rating: 4.7, description: "Aesthetic hand-painted trays for serving and display.", slug: "decorative-trays", image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=400&h=300&fit=crop" },
      { name: "Mini Decor Statues", price: 549, seller: "MittiCraft", rating: 4.5, description: "Small handmade statues for shelves and tabletops.", slug: "mini-statues", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop" },
    ],
  },
  textile: {
    title: "Textile",
    image: categoryTextile,
    products: [
      { name: "Cotton Sarees", price: 1999, seller: "LoomArt", rating: 4.9, description: "Handwoven pure cotton sarees with traditional motifs.", slug: "cotton-sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop" },
      { name: "Silk Sarees", price: 4999, seller: "SilkWeave", rating: 4.9, description: "Luxurious handloom silk sarees with rich zari work.", slug: "silk-sarees", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop" },
      { name: "Handloom Sarees", price: 2499, seller: "LoomArt", rating: 4.8, description: "Authentic handloom sarees from traditional weavers.", slug: "handloom-sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop" },
      { name: "Shawls", price: 1299, seller: "ThreadWorks", rating: 4.7, description: "Warm handwoven shawls in wool and pashmina blends.", slug: "shawls", image: "https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=400&h=300&fit=crop" },
      { name: "Scarves", price: 599, seller: "ThreadWorks", rating: 4.6, description: "Hand-embroidered scarves with intricate patterns.", slug: "scarves", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop" },
      { name: "Dupattas", price: 799, seller: "PrintCraft", rating: 4.7, description: "Block-printed and hand-dyed dupattas in vibrant colors.", slug: "dupattas", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop" },
      { name: "Cushion Covers", price: 449, seller: "StitchArt", rating: 4.6, description: "Embroidered and printed cushion covers for home decor.", slug: "cushion-covers", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop" },
      { name: "Curtains", price: 1499, seller: "StitchArt", rating: 4.7, description: "Handwoven and block-printed curtains for elegant interiors.", slug: "curtains", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop" },
      { name: "Table Runners", price: 699, seller: "StitchArt", rating: 4.5, description: "Beautifully crafted table runners with traditional designs.", slug: "table-runners", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=300&fit=crop" },
      { name: "Bed Sheets", price: 1799, seller: "LoomArt", rating: 4.8, description: "Premium handloom bed sheets with natural dyes.", slug: "bed-sheets", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop" },
      { name: "Khadi Fabrics", price: 899, seller: "KhadiCraft", rating: 4.7, description: "Authentic hand-spun khadi fabric by the meter.", slug: "khadi-fabrics", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
      { name: "Linen Fabrics", price: 1099, seller: "LoomArt", rating: 4.6, description: "Premium quality handloom linen fabric for garments.", slug: "linen-fabrics", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
      { name: "Embroidered Dresses", price: 2499, seller: "ThreadWorks", rating: 4.8, description: "Hand-embroidered dresses with intricate needlework.", slug: "embroidered-dresses", image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=300&fit=crop" },
      { name: "Handloom Garments", price: 1999, seller: "KhadiCraft", rating: 4.7, description: "Ready-to-wear garments from handloom fabrics.", slug: "handloom-garments", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
      { name: "Handmade Bags", price: 899, seller: "PrintCraft", rating: 4.6, description: "Eco-friendly handmade textile bags with block prints.", slug: "handmade-bags", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop" },
      { name: "Textile Wall Art", price: 1299, seller: "StitchArt", rating: 4.8, description: "Fabric-based wall art with embroidery and applique.", slug: "textile-wall-art", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&h=300&fit=crop" },
      { name: "Crochet Tops", price: 799, seller: "HookStyle", rating: 4.6, description: "Trendy crochet tops handmade with love.", slug: "crochet-tops", image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=300&fit=crop" },
      { name: "Wool Fabrics", price: 1199, seller: "ThreadWorks", rating: 4.5, description: "Hand-spun wool fabrics for winter wear and crafts.", slug: "wool-fabrics", image: "https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=400&h=300&fit=crop" },
      { name: "Designer Fabrics", price: 1499, seller: "SilkWeave", rating: 4.7, description: "Exclusive designer fabrics for custom tailoring.", slug: "designer-fabrics", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
      { name: "Printed Fabrics", price: 699, seller: "PrintCraft", rating: 4.6, description: "Hand block-printed fabrics in traditional patterns.", slug: "printed-fabrics", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" },
    ],
  },
  gifts: {
    title: "Gift Products",
    image: categoryGifts,
    products: [
      { name: "Customized Photo Albums", price: 799, seller: "PaperLove", rating: 4.9, description: "Handmade photo albums with personalized covers and layouts.", slug: "photo-albums", image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=300&fit=crop" },
      { name: "Scrapbooks", price: 899, seller: "PaperLove", rating: 4.8, description: "Creative handmade scrapbooks to preserve precious memories.", slug: "scrapbooks", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop" },
      { name: "Handmade Greeting Cards", price: 149, seller: "CardCraft", rating: 4.6, description: "Beautiful handcrafted greeting cards for every occasion.", slug: "greeting-cards", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=300&fit=crop" },
      { name: "Explosion Boxes", price: 599, seller: "WrapJoy", rating: 4.9, description: "Surprise explosion boxes with photos, messages & treats.", slug: "explosion-boxes", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
      { name: "Photo Frames", price: 449, seller: "FrameArt", rating: 4.7, description: "Decorated wooden & fabric photo frames with custom designs.", slug: "photo-frames", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
      { name: "Customized Mugs", price: 349, seller: "PrintHouse", rating: 4.5, description: "Custom mugs with names, quotes, photos or artwork.", slug: "customized-mugs", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" },
      { name: "Customized Water Bottles", price: 499, seller: "PrintHouse", rating: 4.6, description: "Personalized water bottles with custom prints and names.", slug: "water-bottles", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop" },
      { name: "Customized T-Shirts", price: 599, seller: "PrintHouse", rating: 4.5, description: "Custom printed t-shirts with your own designs and text.", slug: "custom-tshirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" },
      { name: "Personalized Keychains", price: 199, seller: "TinyGifts", rating: 4.7, description: "Custom name and photo keychains in metal, wood & acrylic.", slug: "personalized-keychains", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=300&fit=crop" },
      { name: "Name Bracelets", price: 299, seller: "TinyGifts", rating: 4.6, description: "Handcrafted bracelets with custom name beads.", slug: "name-bracelets", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop" },
      { name: "Friendship Bands", price: 149, seller: "TinyGifts", rating: 4.5, description: "Colorful handmade friendship bands with custom patterns.", slug: "friendship-bands", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop" },
      { name: "Handmade Journals", price: 499, seller: "PaperLove", rating: 4.8, description: "Leather-bound and fabric-covered handmade journals.", slug: "handmade-journals", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop" },
      { name: "Personalized Notebooks", price: 349, seller: "PaperLove", rating: 4.6, description: "Custom cover notebooks with name and artwork.", slug: "personalized-notebooks", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop" },
      { name: "Mini Gift Hampers", price: 699, seller: "WrapJoy", rating: 4.9, description: "Curated mini hampers with handmade goodies & treats.", slug: "mini-hampers", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
      { name: "Chocolate Gift Boxes", price: 549, seller: "WrapJoy", rating: 4.7, description: "Beautifully packaged artisan chocolate gift boxes.", slug: "chocolate-boxes", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=300&fit=crop" },
      { name: "Customized Calendars", price: 399, seller: "PrintHouse", rating: 4.5, description: "Photo calendars with personalized dates and messages.", slug: "custom-calendars", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop" },
      { name: "Photo Cushions", price: 649, seller: "StitchGift", rating: 4.7, description: "Soft cushions printed with your favorite photos.", slug: "photo-cushions", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop" },
      { name: "Memory Boxes", price: 799, seller: "WrapJoy", rating: 4.8, description: "Decorative keepsake boxes for storing precious memories.", slug: "memory-boxes", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
      { name: "Handmade Toy Gifts", price: 449, seller: "ToyArt", rating: 4.6, description: "Safe handmade plush toys and wooden toy gifts for kids.", slug: "toy-gifts", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop" },
      { name: "Customized Stickers", price: 99, seller: "CardCraft", rating: 4.4, description: "Custom vinyl and paper stickers with fun designs.", slug: "custom-stickers", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=300&fit=crop" },
      { name: "Personalized Phone Cases", price: 499, seller: "PrintHouse", rating: 4.6, description: "Custom phone cases with photos, artwork or names.", slug: "phone-cases", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop" },
      { name: "Wedding Return Gifts", price: 299, seller: "WrapJoy", rating: 4.8, description: "Elegant handmade return gifts for wedding guests.", slug: "wedding-return-gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
      { name: "Birthday Gift Kits", price: 899, seller: "WrapJoy", rating: 4.9, description: "Complete birthday surprise kits with cards, treats & gifts.", slug: "birthday-kits", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
      { name: "Anniversary Gift Sets", price: 1299, seller: "WrapJoy", rating: 4.9, description: "Romantic curated anniversary gift sets for couples.", slug: "anniversary-sets", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f786?w=400&h=300&fit=crop" },
    ],
  },
};

export { categoryData };

const categoryTitleKeys: Record<string, string> = {
  resin: "cat.resin",
  homedecor: "cat.homedecor",
  textile: "cat.textile",
  gifts: "cat.gifts",
};

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image_url: string | null;
  seller_name: string;
}

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { t } = useLanguage();
  const data = categoryData[category || "resin"];
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);

  useEffect(() => {
    if (!category) return;
    const load = async () => {
      const { data: rows } = await supabase
        .from("seller_products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });
      setSellerProducts((rows || []) as SellerProduct[]);
    };
    load();
    const channel = supabase
      .channel(`seller-products-${category}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seller_products", filter: `category=eq.${category}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  if (!data) return null;

  const translatedTitle = t(categoryTitleKeys[category || "resin"] || "");

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/customer")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground flex-1">{translatedTitle || data.title}</h1>
        <LanguageSelector />
      </header>

      <div className="px-4 pb-4">
        <img src={data.image} alt={data.title} className="w-full h-36 object-cover rounded-xl" />
      </div>

      {sellerProducts.length > 0 && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-display font-semibold text-foreground">Fresh from our artisans</h2>
        </div>
      )}

      <section className="px-4 pb-8 grid grid-cols-2 gap-3">
        {sellerProducts.map((p) => {
          const slug = `seller-${p.id}`;
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/customer/${category}/${slug}`)}
              className="craft-card overflow-hidden text-left"
            >
              <div className="h-28 bg-muted relative overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-body">No image</div>
                )}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-secondary/90 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-secondary-foreground" />
                  <span className="text-[9px] font-semibold text-secondary-foreground font-body">New</span>
                </span>
                <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-body font-semibold text-foreground text-xs truncate">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground font-body line-clamp-2 mt-0.5">
                  {p.description || `Handmade by ${p.seller_name}`}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-primary font-body">₹{p.price}</span>
                  <span className="text-[10px] text-muted-foreground font-body truncate ml-2">{p.seller_name}</span>
                </div>
              </div>
            </button>
          );
        })}

        {sellerProducts.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <p className="text-sm text-muted-foreground font-body">No products yet in this category.</p>
          </div>
        )}

      </section>
    </div>
  );
};

export default CategoryPage;

