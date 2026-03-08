import { create } from "zustand";

export interface CustomOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  productName: string;
  productType: string;
  seller: string;
  price: number;
  wishDescription: string;
  designStyle: string;
  referenceImage: string | null;
  status: "pending" | "accepted" | "modified" | "rejected" | "paid";
  sellerNote?: string;
  createdAt: string;
}

interface OrderStore {
  orders: CustomOrder[];
  addOrder: (order: CustomOrder) => void;
  updateOrderStatus: (id: string, status: CustomOrder["status"], note?: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  updateOrderStatus: (id, status, note) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status, sellerNote: note ?? o.sellerNote } : o
      ),
    })),
}));
