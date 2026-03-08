import { useNavigate } from "react-router-dom";
import { Store, ShoppingBag } from "lucide-react";
import heroCrafts from "@/assets/hero-crafts.jpg";
import craftoraLogo from "@/assets/craftora-logo.png";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    { title: t("home.feature1Title"), desc: t("home.feature1Desc") },
    { title: t("home.feature2Title"), desc: t("home.feature2Desc") },
    { title: t("home.feature3Title"), desc: t("home.feature3Desc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          <img src={craftoraLogo} alt="Craftora" className="w-10 h-10 rounded-full inline-block mr-2 align-middle" />
          Craftora
        </h1>
        <LanguageSelector />
      </header>

      <section className="px-4 pb-6">
        <div className="relative rounded-2xl overflow-hidden">
          <img src={heroCrafts} alt="Handmade craft collection" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-5">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary-foreground leading-tight">
                {t("home.tagline").split(" ").length > 3
                  ? <>{t("home.tagline").split(" ").slice(0, Math.ceil(t("home.tagline").split(" ").length / 2)).join(" ")}<br />{t("home.tagline").split(" ").slice(Math.ceil(t("home.tagline").split(" ").length / 2)).join(" ")}</>
                  : t("home.tagline")
                }
              </h2>
              <p className="text-sm text-primary-foreground/80 mt-1 font-body">{t("home.subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-1">{t("home.joinCommunity")}</h3>
        <p className="text-sm text-muted-foreground mb-5 font-body">{t("home.chooseRole")}</p>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/seller")} className="craft-card p-5 flex flex-col items-center gap-3 text-center group cursor-pointer border-0">
            <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-base">{t("home.seller")}</h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">{t("home.sellerDesc")}</p>
            </div>
          </button>

          <button onClick={() => navigate("/customer")} className="craft-card p-5 flex flex-col items-center gap-3 text-center group cursor-pointer border-0">
            <div className="w-14 h-14 rounded-full gradient-sage flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-base">{t("home.customer")}</h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">{t("home.customerDesc")}</p>
            </div>
          </button>
        </div>
      </section>

      <section className="px-4 pb-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">{t("home.whyCraftora")}</h3>
        <div className="space-y-3">
          {features.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
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
