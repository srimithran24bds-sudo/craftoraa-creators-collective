import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Bot, ChevronDown, ChevronUp } from "lucide-react";

interface QA {
  problem: string;
  solution: string;
  category: string;
}

const knowledgeBase: QA[] = [
  { category: "Resin", problem: "Resin bubbles forming in resin products", solution: "Use slow mixing, warm the resin slightly before pouring, and use a heat gun or torch to pop surface bubbles after pouring." },
  { category: "Resin", problem: "Resin not curing properly", solution: "Check your resin-to-hardener ratio carefully (usually 1:1 by volume). Ensure curing temperature is between 21–24°C. Low temperatures slow curing significantly." },
  { category: "Resin", problem: "Resin turning yellow over time", solution: "Use UV-resistant resin and store finished pieces away from direct sunlight. Adding UV stabilizer can also help." },
  { category: "Pricing", problem: "Product pricing confusion", solution: "Calculate: Material cost + Labor (hourly rate × time) + Packaging + Shipping + Platform fees + Profit margin (30-50%). Research competitors for market pricing." },
  { category: "Pricing", problem: "Customers say products are too expensive", solution: "Highlight the handmade value, share your creative process on social media, and offer different price tiers with varying sizes or complexity." },
  { category: "Shipping", problem: "Product damage during shipping", solution: "Use bubble wrap for fragile items, rigid boxes instead of soft mailers, cushioning materials like shredded paper, and mark packages as 'Fragile'." },
  { category: "Shipping", problem: "High shipping costs reducing sales", solution: "Negotiate bulk rates with courier services, offer flat-rate shipping, or bundle the shipping cost into product price for 'free shipping' perception." },
  { category: "Sales", problem: "Low product sales", solution: "Improve product photography with natural lighting, add storytelling descriptions, promote actively on social media, and engage with craft communities." },
  { category: "Sales", problem: "Getting first customers is difficult", solution: "Start with friends and family, offer launch discounts, participate in local craft fairs, and leverage Instagram hashtags for your craft niche." },
  { category: "Photography", problem: "Product photos look unprofessional", solution: "Use natural daylight near a window, a plain white/neutral background, and your phone camera. Edit with free apps like Snapseed for brightness and contrast." },
  { category: "Packaging", problem: "Packaging looks unappealing", solution: "Invest in branded stickers, thank-you cards, and eco-friendly materials like kraft paper. Consistent branding makes products memorable." },
  { category: "Marketing", problem: "Don't know how to promote on social media", solution: "Post consistently (3-5 times/week), use reels showing your creative process, engage with followers, use relevant hashtags, and collaborate with micro-influencers." },
];

const categories = [...new Set(knowledgeBase.map((q) => q.category))];

const SellerChatbot = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = knowledgeBase.filter((qa) => {
    const matchesSearch = search === "" || qa.problem.toLowerCase().includes(search.toLowerCase()) || qa.solution.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || qa.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Bot className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">Problem Solver</h1>
          <p className="text-xs text-muted-foreground font-body">Search problems & find solutions</p>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your problem..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${!selectedCategory ? "gradient-warm text-primary-foreground" : "bg-muted text-foreground"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${selectedCategory === cat ? "gradient-warm text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Q&A List */}
      <section className="px-4 pb-8 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground font-body py-8">
            No matching problems found. Try different keywords!
          </p>
        )}
        {filtered.map((qa, i) => (
          <div key={i} className="craft-card overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full p-4 flex items-start gap-3 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm">❓</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-foreground text-sm">{qa.problem}</p>
                <span className="text-[10px] font-body text-primary font-semibold uppercase tracking-wide">{qa.category}</span>
              </div>
              {expandedIndex === i ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </button>
            {expandedIndex === i && (
              <div className="px-4 pb-4 pt-0">
                <div className="bg-secondary/10 rounded-xl p-3 border-l-4 border-secondary">
                  <p className="text-xs font-body font-semibold text-secondary mb-1">💡 Solution</p>
                  <p className="text-sm font-body text-foreground leading-relaxed">{qa.solution}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default SellerChatbot;
