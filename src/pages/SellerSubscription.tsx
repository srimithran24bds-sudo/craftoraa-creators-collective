import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, User, Image as ImageIcon } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: ["List up to 5 products", "Basic profile", "Community access"],
    current: true,
  },
  {
    name: "Pro",
    price: "₹499/mo",
    features: ["Unlimited products", "Priority visibility", "Analytics dashboard", "Promotional tools"],
    current: false,
    popular: true,
  },
  {
    name: "Premium",
    price: "₹999/mo",
    features: ["Everything in Pro", "Featured seller badge", "Custom storefront", "Dedicated support"],
    current: false,
  },
];

const SellerSubscription = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"register" | "plans">("register");
  const [formData, setFormData] = useState({
    name: "", craftType: "", businessName: "", contact: "", location: "", socialMedia: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Crown className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-display font-bold text-foreground">Subscription</h1>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors ${activeTab === "register" ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <User className="w-4 h-4 inline mr-1" />
          Register
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors ${activeTab === "plans" ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <Crown className="w-4 h-4 inline mr-1" />
          Plans
        </button>
      </div>

      {activeTab === "register" && (
        <section className="px-4 pb-8 space-y-4">
          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Seller Details</h3>
            <input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <select
              value={formData.craftType}
              onChange={(e) => updateField("craftType", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none"
            >
              <option value="">Select Craft Type</option>
              <option>Resin Art</option>
              <option>Handmade Jewelry</option>
              <option>Crochet</option>
              <option>Knitting</option>
              <option>Macrame</option>
              <option>Clay Art</option>
              <option>Pottery</option>
              <option>Candle Making</option>
              <option>Textile Design</option>
              <option>Home Decor Crafts</option>
              <option>Fashion Accessories</option>
              <option>Gift Crafts</option>
            </select>
            <input
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <input
              placeholder="Contact Number"
              value={formData.contact}
              onChange={(e) => updateField("contact", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <input
              placeholder="Location (City, State)"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <input
              placeholder="Social Media Links (Instagram, etc.)"
              value={formData.socialMedia}
              onChange={(e) => updateField("socialMedia", e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Upload Images</h3>
            {["Product Photos", "Craft Portfolio", "Workshop Images"].map((label) => (
              <div key={label} className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs font-body">{label}</span>
              </div>
            ))}
          </div>

          <button className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-3 rounded-lg">
            Join Craftoraa Community
          </button>
        </section>
      )}

      {activeTab === "plans" && (
        <section className="px-4 pb-8 space-y-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`craft-card p-5 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 gradient-warm text-primary-foreground text-xs font-body font-semibold rounded-full">
                  Popular
                </span>
              )}
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="font-display font-bold text-foreground text-lg">{plan.name}</h4>
                <span className="font-body font-bold text-primary text-lg">{plan.price}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body text-foreground">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg text-sm font-body font-semibold ${plan.current ? "bg-muted text-muted-foreground" : "gradient-warm text-primary-foreground"}`}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default SellerSubscription;
