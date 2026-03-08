import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, Users, Send } from "lucide-react";

const craftCategories = [
  "Resin Art", "Handmade Jewelry", "Crochet", "Knitting", "Macrame",
  "Clay Art", "Pottery", "Candle Making", "Soap Making", "Embroidery",
  "Textile Design", "Fabric Painting", "Hand Painting", "Wood Craft",
  "Paper Craft", "Origami", "Scrapbooking", "Home Decor Crafts",
  "Floral Crafts", "Fashion Accessories", "DIY Crafts", "Gift Crafts",
];

const mockMessages: Record<string, { sender: string; text: string; time: string }[]> = {
  "Resin Art": [
    { sender: "Priya S.", text: "Has anyone tried UV resin for small pendants? Results?", time: "10:32 AM" },
    { sender: "Ankit V.", text: "Yes! UV resin works great for thin layers. Cures in 2 mins under UV lamp.", time: "10:35 AM" },
    { sender: "Meera P.", text: "I prefer epoxy for bigger molds though. More durable finish.", time: "10:40 AM" },
  ],
  "Handmade Jewelry": [
    { sender: "Rohit K.", text: "What wire gauge do you all use for ear hooks?", time: "9:15 AM" },
    { sender: "Sneha D.", text: "20 gauge is perfect — sturdy but easy to bend.", time: "9:20 AM" },
  ],
};

const SellerConnections = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, { sender: string; text: string; time: string }[]>>(mockMessages);

  const filtered = craftCategories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!chatInput.trim() || !selectedCategory) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLocalMessages((prev) => ({
      ...prev,
      [selectedCategory]: [
        ...(prev[selectedCategory] || []),
        { sender: "You", text: chatInput, time: now },
      ],
    }));
    setChatInput("");
  };

  if (selectedCategory) {
    const msgs = localMessages[selectedCategory] || [];
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-4 py-4 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSelectedCategory(null)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <MessageCircle className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-base font-display font-bold text-foreground">{selectedCategory}</h1>
            <p className="text-xs text-muted-foreground font-body">Community Chat</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {msgs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground font-body py-8">
              No messages yet. Start the conversation! 🎨
            </p>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-body ${m.sender === "You" ? "gradient-warm text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                {m.sender !== "You" && (
                  <p className="text-xs font-semibold text-primary mb-1">{m.sender}</p>
                )}
                <p>{m.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
            />
            <button onClick={sendMessage} className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Users className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-display font-bold text-foreground">Connections</h1>
      </header>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search craft categories..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
          />
        </div>
      </div>

      <section className="px-4 pb-8 space-y-2">
        {filtered.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="craft-card w-full p-4 flex items-center gap-3 text-left cursor-pointer border-0"
          >
            <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body font-semibold text-foreground text-sm">{cat}</h4>
              <p className="text-xs text-muted-foreground font-body">Tap to join community chat</p>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default SellerConnections;
