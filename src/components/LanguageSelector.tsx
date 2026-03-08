import { useState } from "react";
import { Globe, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/translations";

const languages: { code: Language; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
];

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center relative"
        aria-label={t("common.language")}
      >
        <Globe className="w-5 h-5 text-foreground" />
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center uppercase">
          {language}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setOpen(false)}>
          <div
            className="bg-background w-full max-w-md rounded-t-2xl p-5 pb-8 space-y-3 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-foreground text-lg">{t("common.language")}</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setOpen(false); }}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    language === lang.code
                      ? "gradient-warm text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <p className="font-body font-semibold text-sm">{lang.native}</p>
                  <p className={`text-xs font-body ${language === lang.code ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {lang.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;
