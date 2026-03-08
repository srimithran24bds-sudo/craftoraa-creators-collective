import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Mail, FileText, MessageCircle, Send, Star } from "lucide-react";

const faqs = [
  { q: "How do I upload products?", a: "Go to Products → tap the + button → fill in details and upload images." },
  { q: "How do I change my subscription plan?", a: "Go to Subscription → Plans tab → select the plan you want to upgrade to." },
  { q: "How do I connect with other sellers?", a: "Go to Connections → select your craft category → join the community chat." },
  { q: "How do I contact a customer?", a: "When a customer messages you about a product, you'll see it in your notifications." },
];

const SellerSupport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"help" | "feedback">("help");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [rating, setRating] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
            { icon: Mail, title: "Email Support", desc: "support@craftoraa.com" },
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
            <button className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Submit Feedback
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default SellerSupport;
