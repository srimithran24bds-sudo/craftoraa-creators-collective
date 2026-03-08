import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Package, MapPin, Calendar, Check, X, MessageSquare, Clock, Truck, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchSellerNotifications, respondToNotification, updateOrderTracking } from "@/lib/orderService";
import { supabase } from "@/integrations/supabase/client";

type OrderNotification = {
  id: string;
  status: string;
  match_reason: string | null;
  seller_note: string | null;
  created_at: string;
  orders: {
    id: string;
    order_id: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    delivery_date: string;
    product_name: string;
    product_category: string;
    product_price: number;
    design_style: string | null;
    wish_description: string | null;
    reference_image: string | null;
    payment_method: string | null;
    payment_status: string;
    order_status: string;
  };
  sellers: {
    id: string;
    name: string;
    business_name: string;
  };
};

const trackingSteps = [
  { key: "accepted", label: "Order Accepted", icon: Check },
  { key: "in_production", label: "In Production", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const SellerNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"new" | "accepted" | "all">("new");
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchSellerNotifications();
      setNotifications(data as unknown as OrderNotification[]);
    } catch {
      toast({ title: "Error loading notifications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("order-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "order_notifications" }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleRespond = async (id: string, status: "accepted" | "modified" | "rejected") => {
    try {
      await respondToNotification(id, status, noteText || undefined);
      toast({
        title: status === "accepted" ? "Order Accepted! ✅" : status === "modified" ? "Modification Sent" : "Order Declined",
        description: status === "accepted" ? "Customer will be notified." : undefined,
      });
      setRespondingId(null);
      setNoteText("");
      loadNotifications();
    } catch {
      toast({ title: "Failed to respond", variant: "destructive" });
    }
  };

  const handleUpdateTracking = async (orderId: string, status: string) => {
    try {
      await updateOrderTracking(orderId, status);
      toast({ title: `Status updated: ${status.replace("_", " ")}` });
      loadNotifications();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "new") return n.status === "pending";
    if (activeTab === "accepted") return n.status === "accepted";
    return true;
  });

  const pendingCount = notifications.filter((n) => n.status === "pending").length;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Bell className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold text-foreground">Order Requests</h1>
          <p className="text-xs text-muted-foreground font-body">{pendingCount} new requests</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-4 flex gap-2">
        {([
          { key: "new" as const, label: `New (${pendingCount})` },
          { key: "accepted" as const, label: "Accepted" },
          { key: "all" as const, label: "All" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-body font-semibold transition-colors ${
              activeTab === tab.key ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="px-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="craft-card p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-4 text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground font-body">No order requests yet</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Orders matching your skills will appear here</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {filtered.map((n) => (
            <div key={n.id} className="craft-card overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  n.status === "pending" ? "gradient-warm" : n.status === "accepted" ? "bg-secondary/20" : "bg-muted"
                }`}>
                  <Package className={`w-5 h-5 ${n.status === "pending" ? "text-primary-foreground" : n.status === "accepted" ? "text-secondary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-semibold text-foreground text-sm truncate">{n.orders.product_name}</h4>
                  <p className="text-[10px] text-muted-foreground font-body">
                    {n.orders.customer_name} • ₹{n.orders.product_price}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${
                    n.status === "pending" ? "bg-primary/15 text-primary" :
                    n.status === "accepted" ? "bg-secondary/15 text-secondary" :
                    "bg-muted text-muted-foreground"
                  }`}>{n.status}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === n.id ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === n.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {n.match_reason && (
                    <p className="text-[10px] text-primary font-body font-semibold">🎯 Matched: {n.match_reason}</p>
                  )}

                  {n.orders.wish_description && (
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body font-semibold mb-1">Design Description</p>
                      <p className="text-xs text-foreground font-body italic border-l-2 border-primary/30 pl-2">"{n.orders.wish_description}"</p>
                    </div>
                  )}

                  {n.orders.design_style && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-body">Design Style:</span>
                      <span className="text-xs text-foreground font-body font-medium">{n.orders.design_style}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground truncate">{n.orders.delivery_address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{n.orders.delivery_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-body">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      n.orders.payment_status === "paid" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
                    }`}>
                      {n.orders.payment_method === "cod" ? "Cash on Delivery" : "Paid"}
                    </span>
                  </div>

                  {/* Action buttons for pending */}
                  {n.status === "pending" && (
                    <div className="space-y-2 pt-1">
                      {respondingId === n.id ? (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Add a note or modification suggestion..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full bg-muted rounded-lg px-3 py-2 text-xs font-body text-foreground placeholder:text-muted-foreground outline-none resize-none h-16"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleRespond(n.id, "accepted")} className="flex-1 py-2 rounded-lg gradient-warm text-primary-foreground text-xs font-body font-semibold flex items-center justify-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button onClick={() => handleRespond(n.id, "modified")} className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-body font-semibold flex items-center justify-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" /> Suggest
                            </button>
                            <button onClick={() => handleRespond(n.id, "rejected")} className="py-2 px-3 rounded-lg bg-muted text-muted-foreground text-xs font-body font-semibold">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setRespondingId(n.id)} className="w-full py-2.5 rounded-lg gradient-warm text-primary-foreground text-xs font-body font-semibold">
                          Respond to Order
                        </button>
                      )}
                    </div>
                  )}

                  {/* Tracking for accepted orders */}
                  {n.status === "accepted" && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] text-muted-foreground font-body font-semibold">📦 Order Tracking</p>
                      <div className="space-y-1.5">
                        {trackingSteps.map((step, idx) => {
                          const currentIdx = trackingSteps.findIndex((s) => s.key === n.orders.order_status);
                          const isActive = idx <= currentIdx;
                          const isCurrent = step.key === n.orders.order_status;
                          const isNext = idx === currentIdx + 1;
                          return (
                            <div key={step.key} className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                isActive ? "gradient-warm" : "bg-muted"
                              }`}>
                                <step.icon className={`w-3 h-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                              </div>
                              <span className={`text-xs font-body flex-1 ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                {step.label}
                                {isCurrent && " ✓"}
                              </span>
                              {isNext && (
                                <button
                                  onClick={() => handleUpdateTracking(n.orders.id, step.key)}
                                  className="px-2 py-1 rounded text-[10px] font-body font-semibold bg-primary/10 text-primary"
                                >
                                  Mark
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerNotifications;
