import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Package, Eye, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/orderStore";
import { Badge } from "@/components/ui/badge";

const giftProductTypes = [
  "Photo Albums", "Scrapbooks", "Greeting Cards", "Explosion Boxes",
  "Photo Frames", "Mugs", "Water Bottles", "T-Shirts", "Keychains",
  "Bracelets", "Journals", "Notebooks", "Gift Hampers", "Chocolate Boxes",
  "Calendars", "Photo Cushions", "Memory Boxes", "Toy Gifts", "Stickers",
  "Phone Cases", "Wedding Return Gifts", "Birthday Kits", "Anniversary Sets",
];

const SellerGiftProducts = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateOrderStatus);

  const giftOrders = orders.filter((o) => {
    const giftSlugs = [
      "photo-albums", "scrapbooks", "greeting-cards", "explosion-boxes",
      "photo-frames", "customized-mugs", "water-bottles", "custom-tshirts",
      "personalized-keychains", "name-bracelets", "friendship-bands",
      "handmade-journals", "personalized-notebooks", "mini-hampers",
      "chocolate-boxes", "custom-calendars", "photo-cushions", "memory-boxes",
      "toy-gifts", "custom-stickers", "phone-cases", "wedding-return-gifts",
      "birthday-kits", "anniversary-sets",
    ];
    return giftSlugs.some((slug) => o.productName.toLowerCase().includes(slug.replace(/-/g, " "))) ||
      o.productType === "Custom";
  });

  const pendingGiftOrders = giftOrders.filter((o) => o.status === "pending");
  const activeGiftOrders = giftOrders.filter((o) => o.status === "accepted" || o.status === "modified");

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-green-100 text-green-800",
    modified: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    paid: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">Gift Products</h1>
          <p className="text-xs text-muted-foreground font-body">Manage gift items & custom requests</p>
        </div>
      </header>

      {/* Product Types Overview */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-2">🎁 Gift Product Types</h3>
        <div className="flex flex-wrap gap-1.5">
          {giftProductTypes.map((type) => (
            <span key={type} className="px-2 py-1 rounded-full bg-muted text-[10px] font-body text-muted-foreground">
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 mb-5 grid grid-cols-3 gap-2">
        <div className="craft-card p-3 text-center">
          <p className="text-lg font-bold text-primary font-body">{pendingGiftOrders.length}</p>
          <p className="text-[10px] text-muted-foreground font-body">Pending</p>
        </div>
        <div className="craft-card p-3 text-center">
          <p className="text-lg font-bold text-green-600 font-body">{activeGiftOrders.length}</p>
          <p className="text-[10px] text-muted-foreground font-body">Active</p>
        </div>
        <div className="craft-card p-3 text-center">
          <p className="text-lg font-bold text-foreground font-body">{giftOrders.length}</p>
          <p className="text-[10px] text-muted-foreground font-body">Total</p>
        </div>
      </section>

      {/* Incoming Gift Orders */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">📦 Custom Gift Orders</h3>
        {giftOrders.length === 0 ? (
          <div className="craft-card p-8 flex flex-col items-center text-center">
            <Gift className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground font-body">No gift orders yet</p>
            <p className="text-xs text-muted-foreground font-body mt-1">Customer gift requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {giftOrders.map((order) => (
              <div key={order.id} className="craft-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm">{order.productName}</h4>
                    <p className="text-[10px] text-muted-foreground font-body">by {order.customerName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-body italic mb-2">"{order.wishDescription}"</p>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-body mb-2">
                  <span>🎨 {order.designStyle}</span>
                  <span>₹{order.price}</span>
                  <span>📅 {order.deliveryDate}</span>
                </div>

                {order.referenceImage && (
                  <div className="mb-2">
                    <p className="text-[10px] text-muted-foreground font-body mb-1">Reference image:</p>
                    <img src={order.referenceImage} alt="Reference" className="w-20 h-20 object-cover rounded-lg" />
                  </div>
                )}

                {order.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(order.id, "accepted")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-body"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(order.id, "modified", "Seller suggested design changes")}
                      className="flex-1 text-xs font-body"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" /> Suggest Changes
                    </Button>
                  </div>
                )}

                {order.status === "accepted" && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg">
                    <p className="text-[10px] text-green-700 font-body flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Order accepted — awaiting payment from customer
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SellerGiftProducts;
