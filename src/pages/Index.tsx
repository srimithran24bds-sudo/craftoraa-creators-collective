import { useNavigate } from "react-router-dom";
import { Store, ShoppingBag, Sparkles } from "lucide-react";
import heroCrafts from "@/assets/hero-crafts.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Craftora
        </h1>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pb-6">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={heroCrafts}
            alt="Handmade craft collection"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-5">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary-foreground leading-tight">
                Where Creativity<br />Meets Community
              </h2>
              <p className="text-sm text-primary-foreground/80 mt-1 font-body">
                Handmade crafts, designs & fashion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-4 pb-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-1">
          Join the Community
        </h3>
        <p className="text-sm text-muted-foreground mb-5 font-body">
          Choose your role to get started
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Seller Card */}
          <button
            onClick={() => navigate("/seller")}
            className="craft-card p-5 flex flex-col items-center gap-3 text-center group cursor-pointer border-0"
          >
            <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-base">
                Seller
              </h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                Create, manage & sell your crafts
              </p>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate("/customer")}
            className="craft-card p-5 flex flex-col items-center gap-3 text-center group cursor-pointer border-0"
          >
            <div className="w-14 h-14 rounded-full gradient-sage flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-base">
                Customer
              </h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                Discover unique handmade products
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 pb-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          Why Craftora?
        </h3>
        <div className="space-y-3">
          {[
            { title: "Handmade & Unique", desc: "Every product is crafted with love and creativity" },
            { title: "Direct from Creators", desc: "Connect directly with artisans and designers" },
            { title: "Community Driven", desc: "Network, learn, and grow with fellow creators" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground font-body">{item.title}</p>
                <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
