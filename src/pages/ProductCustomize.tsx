import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Sparkles, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { categoryData } from "./CategoryPage";

const designStyles = [
  { name: "Aesthetic", desc: "Soft tones with elegant finish", emoji: "✨" },
  { name: "Floral", desc: "Real & pressed flower designs", emoji: "🌸" },
  { name: "Minimal", desc: "Clean lines, subtle beauty", emoji: "◻️" },
  { name: "Vintage", desc: "Classic retro-inspired look", emoji: "🕰️" },
  { name: "Elegant", desc: "Premium luxurious style", emoji: "💎" },
];

const ProductCustomize = () => {
  const navigate = useNavigate();
  const { category, productSlug } = useParams();
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [wishDescription, setWishDescription] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [showDesigns, setShowDesigns] = useState(false);

  const data = categoryData[category || "resin"];
  const product = data?.products.find((p) => p.slug === productSlug);

  if (!product) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (wishDescription.trim()) setShowDesigns(true);
  };

  const handleConfirm = () => {
    if (selectedDesign !== null) {
      navigate(`/order/${category}/${productSlug}`, {
        state: {
          product,
          designStyle: designStyles[selectedDesign].name,
          wishDescription,
          referenceImage,
        },
      });
    }
  };

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
          placeholder='E.g. "I want an aesthetic floral resin frame with golden flakes and pink flowers."'
          value={wishDescription}
          onChange={(e) => setWishDescription(e.target.value)}
          className="bg-card font-body text-sm min-h-[100px]"
        />
        <Button
          onClick={handleGenerate}
          disabled={!wishDescription.trim()}
          className="w-full mt-3 gradient-warm text-primary-foreground font-body"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Design Previews
        </Button>
      </section>

      {/* AI Design Previews */}
      {showDesigns && (
        <section className="px-4 mb-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">🎨 Choose Your Design Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {designStyles.map((style, i) => (
              <button
                key={i}
                onClick={() => setSelectedDesign(i)}
                className={`craft-card p-4 text-left transition-all ${
                  selectedDesign === i
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">{style.emoji}</span>
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

          <Button
            onClick={handleConfirm}
            disabled={selectedDesign === null}
            className="w-full mt-4 bg-secondary text-secondary-foreground font-body"
          >
            Confirm Design & Proceed
          </Button>
        </section>
      )}
    </div>
  );
};

export default ProductCustomize;
