import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Sparkles, Check, Image as ImageIcon, Loader2, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categoryData } from "./CategoryPage";
import { supabase } from "@/integrations/supabase/client";

const designStylesByCategory: Record<string, { name: string; desc: string }[]> = {
  resin: [
    { name: "Aesthetic", desc: "Soft tones with elegant finish" },
    { name: "Floral", desc: "Real & pressed flower designs" },
    { name: "Minimal", desc: "Clean lines, subtle beauty" },
    { name: "Vintage", desc: "Classic retro-inspired look" },
    { name: "Elegant", desc: "Premium luxurious style" },
  ],
  homedecor: [
    { name: "Bohemian", desc: "Free-spirited earthy vibes" },
    { name: "Rustic", desc: "Natural textures & raw beauty" },
    { name: "Contemporary", desc: "Modern clean aesthetics" },
    { name: "Traditional", desc: "Classic Indian craft motifs" },
    { name: "Minimalist", desc: "Simple elegant forms" },
  ],
  textile: [
    { name: "Floral", desc: "Floral textile patterns & embroidery" },
    { name: "Traditional Weave", desc: "Classic handloom weaving patterns" },
    { name: "Minimal Modern", desc: "Clean contemporary textile design" },
    { name: "Ethnic", desc: "Rich ethnic motifs & patterns" },
    { name: "Artistic", desc: "Abstract aesthetic textile art" },
  ],
  gifts: [
    { name: "Aesthetic", desc: "Soft pastel tones with elegant finish" },
    { name: "Floral", desc: "Flower patterns & botanical vibes" },
    { name: "Cute", desc: "Adorable kawaii & fun designs" },
    { name: "Minimal", desc: "Clean lines, subtle beauty" },
    { name: "Vintage", desc: "Classic retro-inspired look" },
    { name: "Celebration", desc: "Bright festive party-ready style" },
  ],
};

const nearbyArtisans: Record<string, { name: string; location: string; specialty: string; rating: number }[]> = {
  resin: [
    { name: "Priya Crafts Studio", location: "Chennai, 3.2 km", specialty: "Resin art & jewelry", rating: 4.8 },
    { name: "CraftNest Workshop", location: "Chennai, 5.1 km", specialty: "Resin coasters & decor", rating: 4.9 },
  ],
  homedecor: [
    { name: "MittiCraft Pottery", location: "Pondicherry, 8 km", specialty: "Ceramics & terracotta", rating: 4.7 },
    { name: "WoodCraft Studio", location: "Mahabalipuram, 12 km", specialty: "Wood carving & art", rating: 4.9 },
    { name: "GreenCraft Hub", location: "Chennai, 6 km", specialty: "Bamboo & cane craft", rating: 4.6 },
  ],
  textile: [
    { name: "Kanchipuram Weavers Co-op", location: "Kanchipuram, 72 km", specialty: "Silk & cotton weaving", rating: 4.9 },
    { name: "LoomArt Handlooms", location: "Salem, 45 km", specialty: "Handloom fabrics", rating: 4.8 },
    { name: "ThreadWorks Artisans", location: "Madurai, 60 km", specialty: "Embroidery & needlework", rating: 4.7 },
    { name: "KhadiCraft Collective", location: "Coimbatore, 50 km", specialty: "Khadi & handspun textiles", rating: 4.7 },
  ],
  gifts: [
    { name: "WrapJoy Studio", location: "Chennai, 4 km", specialty: "Gift curation & packaging", rating: 4.9 },
    { name: "PaperLove Crafts", location: "Chennai, 7 km", specialty: "Scrapbooks & paper art", rating: 4.8 },
    { name: "PrintHouse Custom", location: "Chennai, 5 km", specialty: "Custom printing & personalization", rating: 4.6 },
    { name: "TinyGifts Studio", location: "Chennai, 3 km", specialty: "Keychains, bracelets & small gifts", rating: 4.7 },
    { name: "CardCraft Workshop", location: "Chennai, 9 km", specialty: "Greeting cards & stickers", rating: 4.5 },
  ],
};

const ProductCustomize = () => {
  const navigate = useNavigate();
  const { category, productSlug } = useParams();
  const { toast } = useToast();
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [wishDescription, setWishDescription] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<number | null>(null);
  const [showArtisans, setShowArtisans] = useState(false);

  const catKey = category || "resin";
  const data = categoryData[catKey];
  const product = data?.products.find((p) => p.slug === productSlug);
  const designStyles = useMemo(() => designStylesByCategory[catKey] || designStylesByCategory.resin, [catKey]);
  const artisans = useMemo(() => nearbyArtisans[catKey] || nearbyArtisans.resin, [catKey]);

  if (!product) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!wishDescription.trim()) return;
    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedDesign(null);
    setShowArtisans(false);
    setSelectedArtisan(null);

    try {
      const results = await Promise.all(
        designStyles.map(async (style) => {
          try {
            const { data: fnData, error } = await supabase.functions.invoke("generate-design", {
              body: {
                description: wishDescription,
                productName: product.name,
                style: style.name,
              },
            });
            if (error) throw error;
            return fnData?.imageUrl ?? null;
          } catch {
            return null;
          }
        })
      );
      setGeneratedImages(results);

      const successCount = results.filter(Boolean).length;
      if (successCount === 0) {
        toast({ title: "Generation failed", description: "Could not generate images. Please try again.", variant: "destructive" });
      } else {
        toast({ title: `${successCount} designs generated!`, description: "Select your preferred design below." });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDesignSelect = (i: number) => {
    setSelectedDesign(i);
    setShowArtisans(true);
    setSelectedArtisan(null);
  };

  const handleConfirm = () => {
    if (selectedDesign !== null) {
      const artisan = selectedArtisan !== null ? artisans[selectedArtisan] : null;
      navigate(`/order/${category}/${productSlug}`, {
        state: {
          product: artisan ? { ...product, seller: artisan.name } : product,
          designStyle: designStyles[selectedDesign].name,
          wishDescription,
          referenceImage,
          generatedImage: generatedImages[selectedDesign] ?? null,
          artisan: artisan ? { name: artisan.name, location: artisan.location } : null,
        },
      });
    }
  };

  const showDesigns = generatedImages.length > 0 || isGenerating;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">Customize Your Order</h1>
          <p className="text-xs text-muted-foreground font-body">{product.name}</p>
        </div>
      </header>

      {/* Product Info */}
      <div className="px-4 mb-4">
        <div className="craft-card p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm">{product.name}</h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{product.description}</p>
            <p className="text-sm font-bold text-primary font-body mt-1">₹{product.price}</p>
          </div>
        </div>
      </div>

      {/* Reference Image Upload */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-2">📷 Upload Reference Image</h3>
        <label className="craft-card flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors">
          {referenceImage ? (
            <img src={referenceImage} alt="Reference" className="w-full h-32 object-contain rounded-lg" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground font-body">Tap to upload your inspiration photo</p>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </section>

      {/* Wish Description */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-2">✍️ Describe Your Idea</h3>
        <Textarea
          placeholder={
            catKey === "textile"
              ? 'E.g. "I want a handwoven cotton saree with floral embroidery and pastel colors."'
              : 'E.g. "I want an aesthetic floral resin frame with golden flakes and pink flowers."'
          }
          value={wishDescription}
          onChange={(e) => setWishDescription(e.target.value)}
          className="bg-card font-body text-sm min-h-[100px]"
        />
        <Button
          onClick={handleGenerate}
          disabled={!wishDescription.trim() || isGenerating}
          className="w-full mt-3 gradient-warm text-primary-foreground font-body"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Designs...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Design Previews
            </>
          )}
        </Button>
      </section>

      {/* AI Design Previews */}
      {showDesigns && (
        <section className="px-4 mb-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">🎨 Choose Your Design Style</h3>

          {isGenerating ? (
            <div className="grid grid-cols-2 gap-3">
              {designStyles.map((style, i) => (
                <div key={i} className="craft-card p-4">
                  <div className="w-full h-28 bg-muted rounded-lg flex items-center justify-center mb-2 animate-pulse">
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  </div>
                  <h4 className="font-body font-semibold text-foreground text-xs">{style.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5">{style.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {designStyles.map((style, i) => (
                <button
                  key={i}
                  onClick={() => handleDesignSelect(i)}
                  className={`craft-card p-3 text-left transition-all ${
                    selectedDesign === i ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="w-full h-28 bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                    {generatedImages[i] ? (
                      <img
                        src={generatedImages[i]!}
                        alt={`${style.name} design`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground font-body">Failed</span>
                    )}
                  </div>
                  <h4 className="font-body font-semibold text-foreground text-xs">{style.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5">{style.desc}</p>
                  {selectedDesign === i && (
                    <div className="flex items-center gap-1 mt-1.5 text-primary">
                      <Check className="w-3 h-3" />
                      <span className="text-[10px] font-semibold font-body">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Nearby Artisan / Weaver Connection */}
      {showArtisans && selectedDesign !== null && !isGenerating && (
        <section className="px-4 mb-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-2">
            🧵 {catKey === "textile" ? "Nearby Weavers & Artisans" : "Nearby Artisans"}
          </h3>
          <p className="text-xs text-muted-foreground font-body mb-3">
            We found {artisans.length} skilled artisans who can bring your design to life.
          </p>
          <div className="space-y-2">
            {artisans.map((artisan, i) => (
              <button
                key={i}
                onClick={() => setSelectedArtisan(i)}
                className={`craft-card w-full p-3 flex items-center gap-3 text-left transition-all ${
                  selectedArtisan === i ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-semibold text-foreground text-xs truncate">{artisan.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-body">{artisan.specialty}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-body">
                      <MapPin className="w-3 h-3" /> {artisan.location}
                    </span>
                    <span className="text-[10px] text-accent font-body">★ {artisan.rating}</span>
                  </div>
                </div>
                {selectedArtisan === i && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={selectedArtisan === null}
            className="w-full mt-4 bg-secondary text-secondary-foreground font-body"
          >
            Confirm Design & Artisan → Proceed
          </Button>
        </section>
      )}
    </div>
  );
};

export default ProductCustomize;
