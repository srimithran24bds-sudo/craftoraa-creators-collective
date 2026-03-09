import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthGuard from "@/components/AuthGuard";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerConnections from "./pages/SellerConnections";
import SellerChatbot from "./pages/SellerChatbot";
import SellerIdeas from "./pages/SellerIdeas";
import SellerSubscription from "./pages/SellerSubscription";
import SellerSupport from "./pages/SellerSupport";
import CustomerBrowse from "./pages/CustomerBrowse";
import CategoryPage from "./pages/CategoryPage";
import ProductCustomize from "./pages/ProductCustomize";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentPage from "./pages/PaymentPage";
import OrderSummary from "./pages/OrderSummary";
import SellerCustomOrders from "./pages/SellerCustomOrders";
import SellerGiftProducts from "./pages/SellerGiftProducts";
import SellerNotifications from "./pages/SellerNotifications";
import SubscriptionPayment from "./pages/SubscriptionPayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="/seller" element={<AuthGuard><SellerDashboard /></AuthGuard>} />
            <Route path="/seller/products" element={<AuthGuard><SellerProducts /></AuthGuard>} />
            <Route path="/seller/connections" element={<AuthGuard><SellerConnections /></AuthGuard>} />
            <Route path="/seller/chatbot" element={<AuthGuard><SellerChatbot /></AuthGuard>} />
            <Route path="/seller/ideas" element={<AuthGuard><SellerIdeas /></AuthGuard>} />
            <Route path="/seller/subscription" element={<AuthGuard><SellerSubscription /></AuthGuard>} />
            <Route path="/seller/subscription/payment" element={<AuthGuard><SubscriptionPayment /></AuthGuard>} />
            <Route path="/seller/support" element={<AuthGuard><SellerSupport /></AuthGuard>} />
            <Route path="/seller/custom-orders" element={<AuthGuard><SellerCustomOrders /></AuthGuard>} />
            <Route path="/seller/gift-products" element={<AuthGuard><SellerGiftProducts /></AuthGuard>} />
            <Route path="/seller/notifications" element={<AuthGuard><SellerNotifications /></AuthGuard>} />
            <Route path="/customer" element={<AuthGuard><CustomerBrowse /></AuthGuard>} />
            <Route path="/customer/:category" element={<AuthGuard><CategoryPage /></AuthGuard>} />
            <Route path="/customer/:category/:productSlug" element={<AuthGuard><ProductCustomize /></AuthGuard>} />
            <Route path="/order/:category/:productSlug" element={<AuthGuard><OrderConfirmation /></AuthGuard>} />
            <Route path="/payment/:category/:productSlug" element={<AuthGuard><PaymentPage /></AuthGuard>} />
            <Route path="/order-summary" element={<AuthGuard><OrderSummary /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
