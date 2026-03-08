import { supabase } from "@/integrations/supabase/client";

// Category to craft type mapping for smart matching
const categoryToCraftTypes: Record<string, string[]> = {
  resin: ["Resin Art"],
  homedecor: ["Clay Art", "Pottery", "Candle Making", "Home Decor Crafts", "Macrame"],
  textile: ["Textile Design", "Crochet", "Knitting"],
  gifts: ["Gift Crafts", "Handmade Jewelry", "Fashion Accessories"],
};

export async function registerSeller(data: {
  name: string;
  businessName: string;
  craftType: string;
  contact: string;
  location: string;
  socialMedia?: string;
  plan?: string;
  paid?: boolean;
}) {
  const skills = [data.craftType]; // Primary skill from craft type
  const { data: seller, error } = await supabase
    .from("sellers")
    .insert({
      name: data.name,
      business_name: data.businessName,
      craft_type: data.craftType,
      skills,
      contact: data.contact,
      location: data.location,
      social_media: data.socialMedia || null,
      plan: data.plan || "Starter",
      paid: data.paid || false,
    })
    .select()
    .single();

  if (error) throw error;
  return seller;
}

export async function fetchSellers() {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOrder(data: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  designStyle?: string;
  wishDescription?: string;
  referenceImage?: string | null;
  paymentMethod?: string;
}) {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_id: data.orderId,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      delivery_address: data.deliveryAddress,
      delivery_date: data.deliveryDate,
      product_name: data.productName,
      product_category: data.productCategory,
      product_price: data.productPrice,
      design_style: data.designStyle || null,
      wish_description: data.wishDescription || null,
      reference_image: data.referenceImage || null,
      payment_method: data.paymentMethod || null,
      payment_status: data.paymentMethod === "cod" ? "cod" : "paid",
    })
    .select()
    .single();

  if (error) throw error;

  // Smart matching: find relevant sellers
  await matchSellersToOrder(order);

  return order;
}

async function matchSellersToOrder(order: any) {
  // Get matching craft types for the order's category
  const matchingCraftTypes = categoryToCraftTypes[order.product_category] || [];

  // Find sellers by category match
  const { data: sellers } = await supabase
    .from("sellers")
    .select("id, craft_type, location");

  if (!sellers || sellers.length === 0) return;

  const notifications = sellers
    .filter((seller) => {
      // Category match
      const categoryMatch = matchingCraftTypes.includes(seller.craft_type);
      // Location match (simple contains check)
      const locationMatch =
        order.delivery_address &&
        seller.location &&
        order.delivery_address.toLowerCase().includes(seller.location.toLowerCase().split(",")[0]?.trim());
      return categoryMatch || locationMatch;
    })
    .map((seller) => {
      const reasons: string[] = [];
      if (matchingCraftTypes.includes(seller.craft_type)) reasons.push("Category match");
      if (
        order.delivery_address &&
        seller.location &&
        order.delivery_address.toLowerCase().includes(seller.location.toLowerCase().split(",")[0]?.trim())
      )
        reasons.push("Nearby location");
      return {
        order_id: order.id,
        seller_id: seller.id,
        status: "pending",
        match_reason: reasons.join(", "),
      };
    });

  // If no matches, send to ALL sellers as fallback
  if (notifications.length === 0) {
    const fallback = sellers.map((s) => ({
      order_id: order.id,
      seller_id: s.id,
      status: "pending" as const,
      match_reason: "Broadcast to all sellers",
    }));
    if (fallback.length > 0) {
      await supabase.from("order_notifications").insert(fallback);
    }
    return;
  }

  await supabase.from("order_notifications").insert(notifications);
}

export async function fetchSellerNotifications(sellerId?: string) {
  let query = supabase
    .from("order_notifications")
    .select("*, orders(*), sellers(*)")
    .order("created_at", { ascending: false });

  if (sellerId) {
    query = query.eq("seller_id", sellerId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function respondToNotification(
  notificationId: string,
  status: "accepted" | "modified" | "rejected",
  note?: string
) {
  const { error } = await supabase
    .from("order_notifications")
    .update({
      status,
      seller_note: note || null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  if (error) throw error;

  // If accepted, update order status
  if (status === "accepted") {
    const { data: notification } = await supabase
      .from("order_notifications")
      .select("order_id")
      .eq("id", notificationId)
      .single();

    if (notification) {
      await supabase
        .from("orders")
        .update({ order_status: "accepted" })
        .eq("id", notification.order_id);
    }
  }
}

export async function updateOrderTracking(orderId: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId);
  if (error) throw error;
}
