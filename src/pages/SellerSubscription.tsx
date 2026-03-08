import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, User, Upload, Users, CreditCard, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { registerSeller, fetchSellers } from "@/lib/orderService";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: ["List up to 5 products", "Basic profile", "Community access"],
  },
  {
    name: "Pro",
    price: "₹499/mo",
    features: ["Unlimited products", "Priority visibility", "Analytics dashboard", "Promotional tools"],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹999/mo",
    features: ["Everything in Pro", "Featured seller badge", "Custom storefront", "Dedicated support"],
  },
];

type Subscriber = { name: string; craft: string; plan: string; paid: boolean; joinedDate: string; avatar: string };



const SellerSubscription = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"register" | "plans" | "members">("register");
  const [formData, setFormData] = useState({
    name: "", craftType: "", businessName: "", contact: "", location: "", socialMedia: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    "Product Photos": null, "Craft Portfolio": null, "Workshop Images": null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Starter");
  const [memberFilter, setMemberFilter] = useState<"all" | "paid" | "free">("all");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (label: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [label]: file }));
  };

  const isFormValid = formData.name && formData.craftType && formData.businessName && formData.contact && formData.location;

  const handleRegister = () => {
    if (!isFormValid) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const initials = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      const newSubscriber: Subscriber = {
        name: formData.name,
        craft: formData.craftType,
        plan: currentPlan,
        paid: currentPlan !== "Starter",
        joinedDate: new Date().toISOString().split("T")[0],
        avatar: initials,
      };
      setSubscribers((prev) => [newSubscriber, ...prev]);
      setSubmitting(false);
      setRegistered(true);
      toast({ title: "Welcome to Craftora! 🎉", description: "You've successfully joined the community." });
    }, 1200);
  };

  const handleUpgrade = (planName: string) => {
    if (planName === currentPlan) return;
    toast({ title: `Upgrading to ${planName}`, description: "Redirecting to payment..." });
    setTimeout(() => {
      setCurrentPlan(planName);
      toast({ title: `${planName} Plan Activated ✨`, description: "Enjoy your new features!" });
    }, 1500);
  };

  const filteredMembers = subscribers.filter((m) => {
    if (memberFilter === "paid") return m.paid;
    if (memberFilter === "free") return !m.paid;
    return true;
  });

  const totalPaid = subscribers.filter((m) => m.paid).length;
  const totalFree = subscribers.filter((m) => !m.paid).length;

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
        {([
          { key: "register", label: "Register", icon: User },
          { key: "plans", label: "Plans", icon: Crown },
          { key: "members", label: "Members", icon: Users },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-body font-semibold transition-colors ${activeTab === tab.key ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <tab.icon className="w-3.5 h-3.5 inline mr-1" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Register Tab */}
      {activeTab === "register" && (
        <section className="px-4 pb-8 space-y-4">
          {registered ? (
            <div className="craft-card p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg">You're Registered!</h3>
              <p className="text-sm text-muted-foreground font-body">Welcome to the Craftora community, {formData.name}.</p>
              <p className="text-xs text-muted-foreground font-body">Craft Type: {formData.craftType} • {formData.businessName}</p>
              <button onClick={() => setActiveTab("plans")} className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-3 rounded-lg mt-2">
                View Plans & Upgrade
              </button>
            </div>
          ) : (
            <>
              <div className="craft-card p-4 space-y-3">
                <h3 className="font-display font-semibold text-foreground text-sm">Seller Details</h3>
                <input placeholder="Full Name *" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none" />
                <select value={formData.craftType} onChange={(e) => updateField("craftType", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none">
                  <option value="">Select Craft Type *</option>
                  <option>Resin Art</option><option>Handmade Jewelry</option><option>Crochet</option><option>Knitting</option>
                  <option>Macrame</option><option>Clay Art</option><option>Pottery</option><option>Candle Making</option>
                  <option>Textile Design</option><option>Home Decor Crafts</option><option>Fashion Accessories</option><option>Gift Crafts</option>
                </select>
                <input placeholder="Business Name *" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none" />
                <input placeholder="Contact Number *" value={formData.contact} onChange={(e) => updateField("contact", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none" type="tel" />
                <input placeholder="Location (City, State) *" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none" />
                <input placeholder="Social Media Links (Instagram, etc.)" value={formData.socialMedia} onChange={(e) => updateField("socialMedia", e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div className="craft-card p-4 space-y-3">
                <h3 className="font-display font-semibold text-foreground text-sm">Upload Images</h3>
                {["Product Photos", "Craft Portfolio", "Workshop Images"].map((label) => (
                  <label key={label} className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                    {uploadedFiles[label] ? <Check className="w-4 h-4 text-secondary" /> : <Upload className="w-4 h-4" />}
                    <span className="text-xs font-body flex-1">{uploadedFiles[label] ? uploadedFiles[label]!.name : label}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(label, e.target.files?.[0] || null)} />
                  </label>
                ))}
              </div>
              <button onClick={handleRegister} disabled={submitting} className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-3 rounded-lg disabled:opacity-60">
                {submitting ? "Joining..." : "Join Craftora Community"}
              </button>
            </>
          )}
        </section>
      )}

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <section className="px-4 pb-8 space-y-4">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            return (
              <div key={plan.name} className={`craft-card p-5 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 gradient-warm text-primary-foreground text-xs font-body font-semibold rounded-full">Popular</span>
                )}
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="font-display font-bold text-foreground text-lg">{plan.name}</h4>
                  <span className="font-body font-bold text-primary text-lg">{plan.price}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-body text-foreground">
                      <Check className="w-4 h-4 text-secondary shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleUpgrade(plan.name)} disabled={isCurrent} className={`w-full py-2.5 rounded-lg text-sm font-body font-semibold ${isCurrent ? "bg-muted text-muted-foreground" : "gradient-warm text-primary-foreground"}`}>
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </section>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <section className="px-4 pb-8 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="craft-card p-3 text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-foreground text-lg">{subscribers.length}</p>
              <p className="text-[10px] text-muted-foreground font-body">Total</p>
            </div>
            <div className="craft-card p-3 text-center">
              <CreditCard className="w-5 h-5 text-secondary mx-auto mb-1" />
              <p className="font-display font-bold text-foreground text-lg">{totalPaid}</p>
              <p className="text-[10px] text-muted-foreground font-body">Paid</p>
            </div>
            <div className="craft-card p-3 text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="font-display font-bold text-foreground text-lg">{totalFree}</p>
              <p className="text-[10px] text-muted-foreground font-body">Free</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(["all", "paid", "free"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setMemberFilter(f)}
                className={`flex-1 py-2 rounded-lg text-xs font-body font-semibold capitalize transition-colors ${memberFilter === f ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {f === "all" ? "All Members" : f === "paid" ? "Paid" : "Free Plan"}
              </button>
            ))}
          </div>

          {/* Member List */}
          <div className="space-y-2">
            {filteredMembers.map((member, i) => (
              <div key={i} className="craft-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-body font-bold text-xs">{member.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-body font-semibold text-foreground text-sm truncate">{member.name}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-body font-semibold ${
                      member.plan === "Premium" ? "bg-primary/15 text-primary" :
                      member.plan === "Pro" ? "bg-secondary/15 text-secondary" :
                      "bg-muted text-muted-foreground"
                    }`}>{member.plan}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">{member.craft}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold px-2 py-1 rounded-full ${
                    member.paid ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
                  }`}>
                    {member.paid ? <><CreditCard className="w-3 h-3" /> Paid</> : "Free"}
                  </span>
                  <p className="text-[10px] text-muted-foreground font-body mt-1">{new Date(member.joinedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SellerSubscription;
