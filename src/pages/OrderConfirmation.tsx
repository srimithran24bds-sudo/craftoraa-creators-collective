import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/store/orderStore";
import NearbySellerMap from "@/components/NearbySellerMap";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, productSlug } = useParams();
  const state = location.state as {
    product: { name: string; price: number; seller: string };
    designStyle: string;
    wishDescription: string;
    referenceImage: string | null;
  } | null;
  const addOrder = useOrderStore((s) => s.addOrder);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });

  if (!state) {
    navigate(`/customer/${category}`);
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = form.name && form.phone && form.address && form.deliveryDate;

  const handleProceed = () => {
    // Save custom order for seller dashboard
    addOrder({
      id: `CRA-${Date.now().toString(36).toUpperCase()}`,
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      deliveryDate: form.deliveryDate,
      productName: state.product.name,
      productType: "Custom",
      seller: state.product.seller,
      price: state.product.price,
      wishDescription: state.wishDescription,
      designStyle: state.designStyle,
      referenceImage: state.referenceImage ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    navigate(`/payment/${category}/${productSlug}`, {
      state: { ...state, customerDetails: form },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">Order Details</h1>
      </header>

      {/* Order Summary Card */}
      <div className="px-4 mb-5">
        <div className="craft-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">{state.product.name}</h3>
              <p className="text-xs text-muted-foreground font-body">Design: {state.designStyle}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-body italic">"{state.wishDescription}"</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground font-body">Seller: {state.product.seller}</span>
            <span className="text-sm font-bold text-primary font-body">₹{state.product.price}</span>
          </div>
        </div>
      </div>

      {/* Customer Details Form */}
      <section className="px-4 space-y-4">
        <h3 className="text-sm font-display font-semibold text-foreground">📋 Your Details</h3>

        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Full Name</label>
          <Input
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="bg-card font-body"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Contact Number</label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="bg-card font-body"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Delivery Address</label>
          <Input
            placeholder="Enter full delivery address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="bg-card font-body"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Preferred Delivery Date</label>
          <Input
            type="date"
            value={form.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
            className="bg-card font-body"
          />
        </div>

        <Button
          onClick={handleProceed}
          disabled={!isValid}
          className="w-full gradient-warm text-primary-foreground font-body mt-2"
        >
          Proceed to Payment
        </Button>
      </section>
    </div>
  );
};

export default OrderConfirmation;
