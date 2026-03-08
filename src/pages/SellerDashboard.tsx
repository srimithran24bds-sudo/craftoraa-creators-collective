import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package, Users, Bot, Lightbulb, Crown, HeadphonesIcon, ShoppingBag, Gift, Bell,
} from "lucide-react";
import { useOrderStore } from "@/store/orderStore";

const sellerFeatures = [
  {
    icon: Bell,
    title: "Order Requests",
    desc: "New orders matched to your skills",
    path: "/seller/notifications",
    gradient: "gradient-warm",
    showBadge: true,
  },
  {
    icon: ShoppingBag,
    title: "Custom Orders",
    desc: "View customer design requests",
    path: "/seller/custom-orders",
    gradient: "gradient-warm",
  },
  {
    icon: Gift,
    title: "Gift Products",
    desc: "Manage gift items & custom requests",
    path: "/seller/gift-products",
    gradient: "gradient-warm",
    showGiftBadge: true,
  },
  {
    icon: Package,
    title: "Products",
    desc: "Upload, edit & manage your crafts",
    path: "/seller/products",
    gradient: "gradient-sage",
  },
  {
    icon: Users,
    title: "Connections",
    desc: "Community chat by craft category",
    path: "/seller/connections",
    gradient: "gradient-sage",
  },
  {
    icon: Bot,
    title: "Problem Solver",
    desc: "Search problems & find solutions",
    path: "/seller/chatbot",
    gradient: "gradient-warm",
  },
  {
    icon: Lightbulb,
    title: "Business Ideas",
    desc: "Packaging, promotion & growth tips",
    path: "/seller/ideas",
    gradient: "gradient-sage",
  },
  {
    icon: Crown,
    title: "Subscription",
    desc: "Register & unlock premium features",
    path: "/seller/subscription",
    gradient: "gradient-warm",
  },
  {
    icon: HeadphonesIcon,
    title: "Support & Feedback",
    desc: "Help center, report issues & feedback",
    path: "/seller/support",
    gradient: "gradient-sage",
  },
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const pendingCount = useOrderStore((s) => s.orders.filter((o) => o.status === "pending").length);

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Manage your craft business
          </p>
        </div>
      </header>

      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {sellerFeatures.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="craft-card p-4 flex flex-col items-start gap-3 text-left cursor-pointer border-0 relative"
            >
              {"showBadge" in feature && feature.showBadge && pendingCount > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              <div
                className={`w-11 h-11 rounded-xl ${feature.gradient} flex items-center justify-center`}
              >
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-body leading-tight">
                  {feature.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
