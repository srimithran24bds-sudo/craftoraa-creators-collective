import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Package, Megaphone, BarChart3, Palette, ChevronRight } from "lucide-react";

interface Topic {
  title: string;
  items: string[];
}

interface IdeaSection {
  title: string;
  icon: typeof Lightbulb;
  gradient: string;
  topics: Topic[];
}

const ideaSections: IdeaSection[] = [
  {
    title: "Packaging Techniques",
    icon: Package,
    gradient: "gradient-warm",
    topics: [
      { title: "Eco-Friendly Packaging", items: ["Use recycled kraft paper and cardboard", "Replace plastic with biodegradable fillers", "Add seed paper tags customers can plant", "Use soy-based inks for printing"] },
      { title: "Branded Packaging", items: ["Design custom stickers with your logo", "Add personalized thank-you cards", "Use consistent color schemes", "Include care instruction cards"] },
      { title: "Protective Packaging", items: ["Bubble wrap for fragile resin and glass items", "Rigid corrugated boxes for shipping", "Tissue paper layers for delicate textiles", "Custom inserts for jewelry pieces"] },
    ],
  },
  {
    title: "Promotion Methods",
    icon: Megaphone,
    gradient: "gradient-sage",
    topics: [
      { title: "Social Media Promotion", items: ["Post behind-the-scenes content daily", "Create Instagram Reels showing your process", "Use trending audio for reach", "Engage in craft community hashtags"] },
      { title: "Influencer Collaboration", items: ["Partner with micro-influencers (1K-10K followers)", "Send free samples for honest reviews", "Co-create limited edition products", "Run giveaway collaborations"] },
      { title: "Product Photography Tips", items: ["Use natural window light for warm tones", "Keep backgrounds clean and minimal", "Show products in lifestyle settings", "Capture close-up detail shots"] },
    ],
  },
  {
    title: "Advertising",
    icon: BarChart3,
    gradient: "gradient-warm",
    topics: [
      { title: "Online Advertising", items: ["Run targeted Instagram/Facebook ads", "Use Pinterest for craft product discovery", "Google Shopping ads for product visibility", "Retarget visitors who didn't purchase"] },
      { title: "Offline Promotion", items: ["Participate in local craft fairs and exhibitions", "Set up pop-up shops at markets", "Collaborate with local boutiques", "Distribute business cards and flyers"] },
    ],
  },
  {
    title: "Business Tips",
    icon: Palette,
    gradient: "gradient-sage",
    topics: [
      { title: "Pricing Strategies", items: ["Cost-plus pricing: materials + labor + profit margin", "Research competitor pricing in your niche", "Offer tiered pricing (small, medium, large)", "Bundle products for higher perceived value"] },
      { title: "Customer Engagement", items: ["Respond to messages within 24 hours", "Send personalized order confirmations", "Ask for reviews after delivery", "Create a loyalty/referral program"] },
      { title: "Branding Ideas", items: ["Define your unique story and share it", "Create a consistent visual identity", "Develop a memorable brand name and tagline", "Build an authentic online presence"] },
    ],
  },
];

const SellerIdeas = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Lightbulb className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">Business Ideas</h1>
          <p className="text-xs text-muted-foreground font-body">Grow your craft business</p>
        </div>
      </header>

      <section className="px-4 pb-8 space-y-3">
        {ideaSections.map((section, si) => (
          <div key={section.title} className="craft-card overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === si ? null : si)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div className={`w-11 h-11 rounded-xl ${section.gradient} flex items-center justify-center shrink-0`}>
                <section.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-semibold text-foreground text-sm">{section.title}</h4>
                <p className="text-xs text-muted-foreground font-body">{section.topics.length} topics</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSection === si ? "rotate-90" : ""}`} />
            </button>

            {expandedSection === si && (
              <div className="px-4 pb-4 space-y-2">
                {section.topics.map((topic) => (
                  <div key={topic.title} className="bg-muted/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedTopic(expandedTopic === topic.title ? null : topic.title)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-body font-semibold text-foreground">{topic.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedTopic === topic.title ? "rotate-90" : ""}`} />
                    </button>
                    {expandedTopic === topic.title && (
                      <ul className="px-3 pb-3 space-y-1.5">
                        {topic.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-xs font-body text-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default SellerIdeas;
