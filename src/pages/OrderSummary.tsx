import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, MapPin, Calendar, User, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    product: { name: string; price: number; seller: string };
    designStyle: string;
    wishDescription: string;
    customerDetails: { name: string; phone: string; address: string; deliveryDate: string };
    paymentMethod: string;
  } | null;

  if (!state) {
    navigate("/customer");
    return null;
  }

  const orderId = `CRA-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Success Header */}
      <div className="gradient-warm px-4 pt-10 pb-8 text-center">
        <CheckCircle className="w-14 h-14 text-primary-foreground mx-auto mb-3" />
        <h1 className="text-xl font-display font-bold text-primary-foreground">Order Confirmed!</h1>
        <p className="text-xs text-primary-foreground/80 font-body mt-1">Order ID: {orderId}</p>
      </div>

      {/* Product Details */}
      <div className="px-4 -mt-4">
        <div className="craft-card p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground text-sm">{state.product.name}</h3>
              <p className="text-xs text-muted-foreground font-body">Design: {state.designStyle}</p>
            </div>
            <span className="text-sm font-bold text-primary font-body">₹{state.product.price}</span>
          </div>

          <p className="text-xs text-muted-foreground font-body italic border-l-2 border-primary/30 pl-3">
            "{state.wishDescription}"
          </p>

          <div className="border-t border-border pt-3 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-body">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Seller:</span>
              <span className="text-foreground font-medium">{state.product.seller}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Customer:</span>
              <span className="text-foreground font-medium">{state.customerDetails.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground">{state.customerDetails.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs font-body">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <span className="text-foreground">{state.customerDetails.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Delivery by:</span>
              <span className="text-foreground font-medium">{state.customerDetails.deliveryDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-body">
              <Truck className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Payment:</span>
              <span className="text-foreground font-medium capitalize">{state.paymentMethod === "cod" ? "Cash on Delivery" : state.paymentMethod?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mt-6 space-y-3">
        <Button className="w-full gradient-warm text-primary-foreground font-body" onClick={() => navigate("/customer")}>
          Continue Shopping
        </Button>
        <Button variant="outline" className="w-full font-body" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
