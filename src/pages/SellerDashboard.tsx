import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package, Users, Bot, Lightbulb, Crown, HeadphonesIcon, ShoppingBag, Gift, Bell,
} from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const pendingCount = useOrderStore((s) => s.orders.filter((o) => o.status === "pending").length);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    setSubscribed(localStorage.getItem("craftora_seller_subscribed") === "true");
  }, []);

  if (subscribed === null) return null;
  if (!subscribed) return <Navigate to="/seller/subscription" replace />;

  const sellerFeatures = [
    { icon: Bell, title: t("seller.orderRequests"), desc: t("seller.orderRequestsDesc"), path: "/seller/notifications", gradient: "gradient-warm", showBadge: true },
    { icon: ShoppingBag, title: t("seller.customOrders"), desc: t("seller.customOrdersDesc"), path: "/seller/custom-orders", gradient: "gradient-warm" },
    { icon: Gift, title: t("seller.giftProducts"), desc: t("seller.giftProductsDesc"), path: "/seller/gift-products", gradient: "gradient-warm", showGiftBadge: true },
    { icon: Package, title: t("seller.products"), desc: t("seller.productsDesc"), path: "/seller/products", gradient: "gradient-sage" },
    { icon: Users, title: t("seller.connections"), desc: t("seller.connectionsDesc"), path: "/seller/connections", gradient: "gradient-sage" },
    { icon: Bot, title: t("seller.problemSolver"), desc: t("seller.problemSolverDesc"), path: "/seller/chatbot", gradient: "gradient-warm" },
    { icon: Lightbulb, title: t("seller.businessIdeas"), desc: t("seller.businessIdeasDesc"), path: "/seller/ideas", gradient: "gradient-sage" },
    { icon: Crown, title: t("seller.subscription"), desc: t("seller.subscriptionDesc"), path: "/seller/subscription", gradient: "gradient-warm" },
    { icon: HeadphonesIcon, title: t("seller.support"), desc: t("seller.supportDesc"), path: "/seller/support", gradient: "gradient-sage" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold text-foreground">{t("seller.dashboard")}</h1>
          <p className="text-xs text-muted-foreground font-body">{t("seller.manageBusiness")}</p>
        </div>
        <LanguageSelector />
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
              <div className={`w-11 h-11 rounded-xl ${feature.gradient} flex items-center justify-center`}>
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-body leading-tight">{feature.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
