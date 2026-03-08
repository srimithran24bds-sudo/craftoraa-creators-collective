import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Mail, FileText, MessageCircle, Send, Star, CheckCircle, Clock, Upload, Save, User, Building2, Paperclip } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "How do I upload products?", a: "Go to Products → tap the + button → fill in details and upload images." },
  { q: "How do I change my subscription plan?", a: "Go to Subscription → Plans tab → select the plan you want to upgrade to." },
  { q: "How do I connect with other sellers?", a: "Go to Connections → select your craft category → join the community chat." },
  { q: "How do I contact a customer?", a: "When a customer messages you about a product, you'll see it in your notifications." },
];

interface FeedbackEntry {
  id?: string;
  type: string;
  message: string;
  rating: number;
  date: string;
  status: string;
  name: string;
  businessName: string;
  logoFile?: string;
  attachmentFile?: string;
}

const SellerSupport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"help" | "feedback">("help");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [rating, setRating] = useState(0);
  const [sellerName, setSellerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);

  // Load all feedback from database
  useEffect(() => {
    const loadFeedback = async () => {
      const { data, error } = await supabase
        .from("seller_feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) {
        setFeedbackList(
          data.map((row: any) => ({
            id: row.id,
            type: row.type,
            message: row.message,
            rating: row.rating,
            date: row.created_at?.split("T")[0] || "",
            status: row.status,
            name: row.name,
            businessName: row.business_name,
            logoFile: row.logo_file,
            attachmentFile: row.attachment_file,
          }))
        );
      }
    };
    loadFeedback();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!sellerName.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!businessName.trim()) {
      toast({ title: "Business name required", description: "Please enter your business name.", variant: "destructive" });
      return;
    }
    if (!feedback.trim()) {
      toast({ title: "Empty feedback", description: "Please write your feedback before submitting.", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Rating required", description: "Please rate your experience.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data: inserted, error } = await supabase
        .from("seller_feedback")
        .insert({
          name: sellerName,
          business_name: businessName,
          type: feedbackType,
          message: feedback,
          rating,
          logo_file: logoFile?.name || null,
          attachment_file: attachmentFile?.name || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: FeedbackEntry = {
        id: inserted.id,
        type: inserted.type,
        message: inserted.message,
        rating: inserted.rating,
        date: inserted.created_at?.split("T")[0] || "",
        status: inserted.status,
        name: inserted.name,
        businessName: inserted.business_name,
        logoFile: inserted.logo_file,
        attachmentFile: inserted.attachment_file,
      };
      setFeedbackList((prev) => [newEntry, ...prev]);
      setFeedback("");
      setRating(0);
      setFeedbackType("suggestion");
      setSellerName("");
      setBusinessName("");
      setLogoFile(null);
      setAttachmentFile(null);
      toast({ title: "Feedback saved! 💬", description: "Thank you for helping us improve Craftora." });
    } catch {
      toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel = (t: string) => {
    const map: Record<string, string> = { suggestion: "💡 Suggestion", bug: "🐛 Bug", feature: "✨ Feature", complaint: "⚠️ Complaint" };
    return map[t] || t;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">Support & Feedback</h1>
      </header>

      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => setActiveTab("help")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors ${activeTab === "help" ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Help Center
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors ${activeTab === "feedback" ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Feedback
        </button>
      </div>

      {activeTab === "help" && (
        <section className="px-4 pb-8 space-y-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Frequently Asked Questions</h3>
          {faqs.map((faq, i) => (
            <div key={i} className="craft-card overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full p-4 flex items-start gap-3 text-left">
                <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="font-body font-semibold text-foreground text-sm flex-1">{faq.q}</p>
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 pt-0 pl-11">
                  <p className="text-sm font-body text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          <h3 className="font-display font-semibold text-foreground text-sm pt-4">Contact Us</h3>
          {[
            { icon: MessageCircle, title: "Live Chat", desc: "Talk to our support team" },
            { icon: Mail, title: "Email Support", desc: "support@craftora.com" },
            { icon: FileText, title: "Seller Guide", desc: "Step-by-step tutorials" },
          ].map((opt, i) => (
            <button key={i} className="craft-card w-full p-4 flex items-center gap-3 text-left cursor-pointer border-0">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <opt.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-body font-semibold text-foreground text-sm">{opt.title}</h4>
                <p className="text-xs text-muted-foreground font-body">{opt.desc}</p>
              </div>
            </button>
          ))}
        </section>
      )}

      {activeTab === "feedback" && (
        <section className="px-4 pb-8 space-y-4">
          {/* Seller Info */}
          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Your Details</h3>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Your Name *"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business Name *"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <label className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground cursor-pointer hover:border-primary transition-colors">
              {logoFile ? <CheckCircle className="w-4 h-4 text-secondary" /> : <Upload className="w-4 h-4" />}
              <span className="text-xs font-body flex-1">{logoFile ? logoFile.name : "Upload Business Logo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Rating */}
          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Rate Your Experience</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star className={`w-7 h-7 ${star <= rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="craft-card p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Share Your Feedback</h3>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none"
            >
              <option value="suggestion">Suggestion</option>
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
              <option value="complaint">Complaint</option>
            </select>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={4}
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none resize-none"
            />
            <label className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground cursor-pointer hover:border-primary transition-colors">
              {attachmentFile ? <CheckCircle className="w-4 h-4 text-secondary" /> : <Paperclip className="w-4 h-4" />}
              <span className="text-xs font-body flex-1">{attachmentFile ? attachmentFile.name : "Attach File (screenshot, document, etc.)"}</span>
              <input type="file" className="hidden" onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)} />
            </label>
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting}
              className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Saving..." : "Save Feedback"}
            </button>
          </div>

          {/* Past Feedback */}
          {feedbackList.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-foreground text-sm">Your Feedback History</h3>
              {feedbackList.map((entry, i) => (
                <div key={entry.id || i} className="craft-card p-4 space-y-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full gradient-warm flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-body font-bold text-xs">
                        {(entry.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-foreground text-sm truncate">{entry.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body truncate">{entry.businessName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      entry.status === "reviewed" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"
                    }`}>
                      {entry.status === "reviewed" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {entry.status === "reviewed" ? "Reviewed" : "Submitted"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body font-semibold text-foreground">{typeLabel(entry.type)}</span>
                  </div>
                  <p className="text-sm font-body text-muted-foreground">{entry.message}</p>
                  {(entry.logoFile || entry.attachmentFile) && (
                    <div className="flex flex-wrap gap-2">
                      {entry.logoFile && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-body text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          <Upload className="w-3 h-3" /> {entry.logoFile}
                        </span>
                      )}
                      {entry.attachmentFile && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-body text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          <Paperclip className="w-3 h-3" /> {entry.attachmentFile}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= entry.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body">{new Date(entry.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SellerSupport;
