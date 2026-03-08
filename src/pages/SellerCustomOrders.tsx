import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, MessageSquare, Edit3, Package, MapPin, Calendar, User, Phone, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateOrderTracking } from "@/lib/orderService";

type Order = {
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
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-accent/20 text-accent-foreground",
  accepted: "bg-secondary/20 text-secondary",
  in_production: "bg-primary/20 text-primary",
  shipped: "bg-primary/20 text-primary",
  delivered: "bg-secondary/20 text-secondary",
};

const statusLabels: Record<string, string> = {
  pending: "⏳ Pending",
  accepted: "✅ Accepted",
  in_production: "🔨 In Production",
  shipped: "🚚 Shipped",
  delivered: "📦 Delivered",
};

const SellerCustomOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modifyNote, setModifyNote] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "accepted">("all");

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch {
      toast({ title: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Realtime subscription for new orders
    const channel = supabase
      .channel("seller-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        loadOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAccept = async (orderId: string) => {
    try {
      await updateOrderTracking(orderId, "accepted");
      toast({ title: "Order Accepted! ✅" });
      loadOrders();
    } catch {
      toast({ title: "Failed to accept", variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderTracking(orderId, status);
      toast({ title: `Status updated: ${status.replace("_", " ")}` });
      loadOrders();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const filtered = orders.filter((o) => {
    if (activeTab === "pending") return o.order_status === "pending";
    if (activeTab === "accepted") return ["accepted", "in_production", "shipped", "delivered"].includes(o.order_status);
    return true;
  });

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-display font-bold text-foreground">All Orders</h1>
          <p className="text-xs text-muted-foreground font-body">{orders.length} total • {pendingCount} pending</p>
        </div>
        <button onClick={() => { setLoading(true); loadOrders(); }} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-4 flex gap-2">
        {([
          { key: "all" as const, label: `All (${orders.length})` },
          { key: "pending" as const, label: `Pending (${pendingCount})` },
          { key: "accepted" as const, label: "Active" },
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
        <div className="px-4 py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-display font-semibold text-foreground text-sm">No orders yet</h3>
          <p className="text-xs text-muted-foreground font-body mt-1">Customer orders will appear here in real-time</p>
        </div>
      ) : (
        <section className="px-4 space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="craft-card overflow-hidden">
              {/* Header - clickable to expand */}
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-semibold text-foreground text-sm truncate">{order.product_name}</h4>
                  <p className="text-[10px] text-muted-foreground font-body">
                    {order.customer_name} • #{order.order_id} • ₹{order.product_price}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold shrink-0 ${statusColors[order.order_status] || "bg-muted text-muted-foreground"}`}>
                  {statusLabels[order.order_status] || order.order_status}
                </span>
              </button>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {/* Contact Details */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground font-body font-semibold">📋 Customer Details</p>
                    <div className="flex items-center gap-2 text-xs font-body">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{order.customer_phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs font-body">
                      <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{order.delivery_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Delivery by:</span>
                      <span className="text-foreground font-medium">{order.delivery_date}</span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground font-body font-semibold">🎨 Order Details</p>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-body text-muted-foreground">Order ID</span>
                        <span className="text-xs font-body font-semibold text-foreground">#{order.order_id}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-body text-muted-foreground">Category</span>
                        <span className="text-xs font-body text-foreground capitalize">{order.product_category}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-body text-muted-foreground">Price</span>
                        <span className="text-sm font-bold text-primary font-body">₹{order.product_price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-body text-muted-foreground">Payment</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-body font-semibold ${
                          order.payment_status === "paid" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
                        }`}>
                          {order.payment_method === "cod" ? "COD" : order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Design Details */}
                  {(order.design_style || order.wish_description) && (
                    <div className="space-y-1.5">
                      {order.design_style && (
                        <div className="flex items-center gap-2 text-xs font-body">
                          <span className="text-muted-foreground">Design Style:</span>
                          <span className="text-foreground font-medium">{order.design_style}</span>
                        </div>
                      )}
                      {order.wish_description && (
                        <p className="text-xs text-foreground font-body italic border-l-2 border-primary/30 pl-2">
                          "{order.wish_description}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reference Image */}
                  {order.reference_image && (
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body mb-1">📷 Reference Image:</p>
                      <img src={order.reference_image} alt="Reference" className="w-full h-24 object-contain rounded-lg bg-muted" />
                    </div>
                  )}

                  {/* Actions for pending orders */}
                  {order.order_status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button size="sm" className="flex-1 gradient-warm text-primary-foreground font-body text-xs" onClick={() => handleAccept(order.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </Button>
                    </div>
                  )}

                  {/* Status update for active orders */}
                  {["accepted", "in_production", "shipped"].includes(order.order_status) && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground font-body font-semibold">📦 Update Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {order.order_status === "accepted" && (
                          <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => handleUpdateStatus(order.id, "in_production")}>
                            🔨 Start Production
                          </Button>
                        )}
                        {order.order_status === "in_production" && (
                          <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => handleUpdateStatus(order.id, "shipped")}>
                            🚚 Mark Shipped
                          </Button>
                        )}
                        {order.order_status === "shipped" && (
                          <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => handleUpdateStatus(order.id, "delivered")}>
                            ✅ Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground font-body">
                    Ordered: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default SellerCustomOrders;
