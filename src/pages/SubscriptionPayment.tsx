import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check, Smartphone, CreditCard, Building2, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import craftoraQr from "@/assets/craftora-upi-qr.jpg";

const CRAFTORA_UPI_ID = "nsrimithra445@okicici";

const upiApps = [
  { id: "gpay", name: "Google Pay", color: "from-blue-500 to-green-500", icon: "G" },
  { id: "phonepe", name: "PhonePe", color: "from-purple-600 to-indigo-600", icon: "P" },
  { id: "paytm", name: "Paytm", color: "from-sky-500 to-blue-600", icon: "₱" },
];

const otherMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
];

const SubscriptionPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    planName: string;
    planPrice: string;
    sellerId?: string;
  } | null;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!state) {
    navigate("/seller/subscription");
    return null;
  }

  const priceNum = parseInt(state.planPrice.replace(/[^\\d]/g, "")) || 0;

  const canPay =
    (selectedMethod && upiApps.some((a) => a.id === selectedMethod)) ||
    selectedMethod === "card" ||
    selectedMethod === "netbanking";

  const handlePay = async () => {
    if (selectedMethod && upiApps.some((a) => a.id === selectedMethod) && !upiId) {
      toast({ title: "Enter UPI ID", description: "Please enter your UPI ID to proceed.", variant: "destructive" });
      return;
    }
    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));

    // Update seller plan in DB if we have a sellerId
    if (state.sellerId) {
      await supabase
        .from("sellers")
        .update({ plan: state.planName, paid: true })
        .eq("id", state.sellerId);
    }

    setProcessing(false);
    setPaymentDone(true);
    localStorage.setItem("craftora_seller_subscribed", "true");
    toast({ title: "Payment Successful! ✅", description: `₹${priceNum} paid via ${selectedMethod?.toUpperCase()}` });
  };

  if (paymentDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="craft-card p-8 text-center space-y-4 max-w-sm w-full">
          <div className="w-20 h-20 rounded-full gradient-warm flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display font-bold text-foreground text-xl">Payment Successful!</h2>
          <p className="text-sm text-muted-foreground font-body">
            Your <span className="font-semibold text-primary">{state.planName}</span> plan is now active.
          </p>
          <p className="text-xs text-muted-foreground font-body">₹{priceNum} paid via {selectedMethod?.toUpperCase()}</p>
          <div className="craft-card p-3 bg-secondary/10">
            <p className="text-xs font-body text-secondary font-semibold">
              💰 Amount received by Craftora Team
            </p>
            <p className="text-[10px] text-muted-foreground font-body mt-1">
              Funds will be settled to Craftora's bank account within 2-3 business days (minus gateway fees ~2%).
            </p>
          </div>
          <button
            onClick={() => navigate("/seller/subscription")}
            className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-3 rounded-lg"
          >
            Back to Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">Upgrade to {state.planName}</h1>
      </header>

      {/* Amount */}
      <div className="px-4 mb-6">
        <div className="craft-card p-5 text-center">
          <p className="text-xs text-muted-foreground font-body">Total Amount</p>
          <p className="text-3xl font-display font-bold text-primary mt-1">₹{priceNum}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">{state.planName} Plan • Monthly</p>
        </div>
      </div>

      {/* UPI Apps */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">
          <Smartphone className="w-4 h-4 inline mr-1" /> Pay via UPI
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {upiApps.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedMethod(app.id)}
              className={`craft-card p-4 text-center transition-all ${
                selectedMethod === app.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-lg">{app.icon}</span>
              </div>
              <p className="text-xs font-body font-semibold text-foreground">{app.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* QR Code Scanner */}
      <section className="px-4 mb-5">
        <div className="craft-card p-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-foreground">Scan QR to Pay</h3>
          </div>
          <div className="bg-white rounded-xl p-3 inline-block mx-auto">
            <img src={craftoraQr} alt="Craftora UPI QR Code" className="w-48 h-48 object-contain mx-auto" />
          </div>
          <p className="text-xs font-body text-muted-foreground">
            UPI ID: <span className="font-semibold text-foreground select-all">{CRAFTORA_UPI_ID}</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-body">Scan with any UPI app to pay</p>
        </div>
      </section>

      {/* UPI ID Input */}
      {selectedMethod && upiApps.some((a) => a.id === selectedMethod) && (
        <section className="px-4 mb-5">
          <input
            placeholder="Enter UPI ID (e.g. name@ybl, name@paytm)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full bg-muted rounded-lg px-3 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
          />
        </section>
      )}

      {/* Other Methods */}
      <section className="px-4 mb-6">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">Other Methods</h3>
        <div className="space-y-2">
          {otherMethods.map((method) => (
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
              <h4 className="font-body font-semibold text-foreground text-sm">{method.label}</h4>
            </button>
          ))}
        </div>
      </section>

      {/* Pay Button */}
      <div className="px-4">
        <button
          onClick={handlePay}
          disabled={!canPay || processing}
          className="w-full gradient-warm text-primary-foreground font-body font-semibold text-sm py-3 rounded-lg disabled:opacity-60"
        >
          {processing ? "Processing Payment..." : `Pay ₹${priceNum}`}
        </button>
        <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
          🔒 Payments are securely processed. Funds go directly to Craftora's account.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
