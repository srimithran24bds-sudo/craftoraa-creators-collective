import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/orderService";
import { useOrderStore } from "@/store/orderStore";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Pay via Google Pay, PhonePe, etc." },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit or Debit card" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "Pay through your bank" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, productSlug } = useParams();
  const state = location.state as {
    product: { name: string; price: number; seller: string };
    designStyle: string;
    wishDescription: string;
    customerDetails: { name: string; phone: string; address: string; deliveryDate: string };
  } | null;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const addOrder = useOrderStore((s) => s.addOrder);

  if (!state) {
    navigate(`/customer/${category}`);
    return null;
  }

  const canPay = selectedMethod === "cod" || (selectedMethod === "upi" && upiId) || selectedMethod === "card" || selectedMethod === "netbanking";

  const handlePay = () => {
    navigate("/order-summary", { state: { ...state, paymentMethod: selectedMethod } });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">Payment</h1>
      </header>

      {/* Amount */}
      <div className="px-4 mb-5">
        <div className="craft-card p-4 text-center">
          <p className="text-xs text-muted-foreground font-body">Total Amount</p>
          <p className="text-3xl font-display font-bold text-primary mt-1">₹{state.product.price}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">{state.product.name}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">💳 Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`craft-card w-full p-4 flex items-center gap-3 text-left transition-all ${
                selectedMethod === method.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedMethod === method.id ? "gradient-warm" : "bg-muted"
              }`}>
                <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h4 className="font-body font-semibold text-foreground text-sm">{method.label}</h4>
                <p className="text-[10px] text-muted-foreground font-body">{method.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* UPI ID Input */}
      {selectedMethod === "upi" && (
        <section className="px-4 mb-5">
          <Input
            placeholder="Enter UPI ID (e.g. name@upi)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="bg-card font-body"
          />
        </section>
      )}

      <div className="px-4">
        <Button
          onClick={handlePay}
          disabled={!canPay}
          className="w-full gradient-warm text-primary-foreground font-body"
        >
          {selectedMethod === "cod" ? "Place Order" : `Pay ₹${state.product.price}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
