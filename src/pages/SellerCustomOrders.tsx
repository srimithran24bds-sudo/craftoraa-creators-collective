import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, MessageSquare, Edit3, Package, MapPin, Calendar, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore, type CustomOrder } from "@/store/orderStore";

const statusColors: Record<CustomOrder["status"], string> = {
  pending: "bg-accent/20 text-accent-foreground",
  accepted: "bg-secondary/20 text-secondary",
  modified: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
  paid: "bg-secondary/20 text-secondary",
};

const statusLabels: Record<CustomOrder["status"], string> = {
  pending: "⏳ Pending",
  accepted: "✅ Accepted",
  modified: "✏️ Modified",
  rejected: "❌ Rejected",
  paid: "💰 Paid",
};

const SellerCustomOrders = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrderStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modifyNote, setModifyNote] = useState("");

  const handleAccept = (id: string) => {
    updateOrderStatus(id, "accepted");
  };

  const handleModify = (id: string) => {
    if (modifyNote.trim()) {
      updateOrderStatus(id, "modified", modifyNote);
      setModifyNote("");
      setExpandedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">Custom Orders</h1>
          <p className="text-xs text-muted-foreground font-body">{orders.length} request{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground text-sm">No custom orders yet</h3>
          <p className="text-xs text-muted-foreground font-body mt-1">Customer requests will appear here</p>
        </div>
      ) : (
        <section className="px-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="craft-card p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-foreground text-sm">{order.customerName}</h4>
                    <p className="text-[10px] text-muted-foreground font-body">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-body font-semibold px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* Product & Design */}
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-body font-semibold text-foreground text-xs">{order.productName}</h5>
                  <span className="text-sm font-bold text-primary font-body">₹{order.price}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-body">Design: {order.designStyle}</p>
                <p className="text-xs text-muted-foreground font-body italic mt-1.5 border-l-2 border-primary/30 pl-2">
                  "{order.wishDescription}"
                </p>
              </div>

              {/* Reference Image */}
              {order.referenceImage && (
                <div className="mb-3">
                  <p className="text-[10px] text-muted-foreground font-body mb-1">📷 Reference Image:</p>
                  <img src={order.referenceImage} alt="Reference" className="w-full h-24 object-contain rounded-lg bg-muted" />
                </div>
              )}

              {/* Delivery Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-[10px] font-body">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">{order.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-[10px] font-body">
                  <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">{order.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-body">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Delivery by:</span>
                  <span className="text-foreground font-medium">{order.deliveryDate}</span>
                </div>
              </div>

              {/* Seller Note */}
              {order.sellerNote && (
                <div className="bg-primary/5 rounded-lg p-2 mb-3 border border-primary/20">
                  <p className="text-[10px] text-muted-foreground font-body">Your note:</p>
                  <p className="text-xs text-foreground font-body">{order.sellerNote}</p>
                </div>
              )}

              {/* Actions */}
              {order.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" className="flex-1 gradient-warm text-primary-foreground font-body text-xs" onClick={() => handleAccept(order.id)}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 font-body text-xs" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <Edit3 className="w-3 h-3 mr-1" /> Modify
                  </Button>
                </div>
              )}

              {/* Modify Input */}
              {expandedId === order.id && order.status === "pending" && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Suggest modifications or add a note for the customer..."
                    value={modifyNote}
                    onChange={(e) => setModifyNote(e.target.value)}
                    className="bg-muted font-body text-xs min-h-[60px]"
                  />
                  <Button size="sm" className="w-full bg-secondary text-secondary-foreground font-body text-xs" onClick={() => handleModify(order.id)}>
                    Send Modification
                  </Button>
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
