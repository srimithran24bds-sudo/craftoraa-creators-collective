import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import categoryResin from "@/assets/category-resin.jpg";
import categoryHomeDecor from "@/assets/category-homedecor.jpg";
import categoryCrochet from "@/assets/category-crochet.jpg";
import categoryAari from "@/assets/category-aari.jpg";
import categoryEmbroidery from "@/assets/category-embroidery.jpg";
import categoryCandle from "@/assets/category-candle.jpg";
import categoryPottery from "@/assets/category-pottery.jpg";
import categoryQuilling from "@/assets/category-quilling.jpg";
import categoryPhotoFrames from "@/assets/category-photoframes.jpg";
import categoryRawMaterials from "@/assets/category-rawmaterials.jpg";
import categoryHandmadeBags from "@/assets/category-handmadebags.jpg";

import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const CustomerBrowse = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const categories = [
    { title: "Resin Products", desc: "Handcrafted resin art & accessories", image: categoryResin, path: "/customer/resin" },
    { title: "Crochet", desc: "Handmade crochet creations", image: categoryCrochet, path: "/customer/crochet" },
    { title: "Aari", desc: "Traditional aari embroidery work", image: categoryAari, path: "/customer/aari" },
    { title: "Embroidery", desc: "Intricate hand embroidery", image: categoryEmbroidery, path: "/customer/embroidery" },
    { title: "Candle", desc: "Artisan handmade candles", image: categoryCandle, path: "/customer/candle" },
    { title: "Pottery", desc: "Hand-thrown clay & ceramic pottery", image: categoryPottery, path: "/customer/pottery" },
    { title: "Quilling", desc: "Delicate paper quilling art", image: categoryQuilling, path: "/customer/quilling" },
    { title: "Photo Frames", desc: "Custom decorated photo frames", image: categoryPhotoFrames, path: "/customer/photoframes" },
    { title: "Raw Materials", desc: "Craft supplies for artisans", image: categoryRawMaterials, path: "/customer/rawmaterials" },
    { title: "Home Decor", desc: "Handmade decor for your space", image: categoryHomeDecor, path: "/customer/homedecor" },
    { title: "Handmade Bags", desc: "Stylish handcrafted bags", image: categoryHandmadeBags, path: "/customer/handmadebags" },
  ];



  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold text-foreground">{t("browse.title")}</h1>
          <p className="text-xs text-muted-foreground font-body">{t("browse.subtitle")}</p>
        </div>
        <LanguageSelector />
      </header>

      <section className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("browse.search")}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
          />
        </div>
      </section>

      <section className="px-4 pb-8">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">{t("browse.categories")}</h3>
        <div className="space-y-4">
          {categories.map((cat) => (
            <button key={cat.title} onClick={() => navigate(cat.path)} className="craft-card w-full flex overflow-hidden cursor-pointer border-0">
              <img src={cat.image} alt={cat.title} className="w-28 h-28 object-cover shrink-0" />
              <div className="p-4 flex flex-col justify-center text-left">
                <h4 className="font-display font-semibold text-foreground text-base">{cat.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{cat.desc}</p>
                <span className="text-xs text-primary font-semibold mt-2 font-body">{t("browse.browseArrow")}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerBrowse;
