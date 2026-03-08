import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/connections" element={<SellerConnections />} />
          <Route path="/seller/chatbot" element={<SellerChatbot />} />
          <Route path="/seller/ideas" element={<SellerIdeas />} />
          <Route path="/seller/subscription" element={<SellerSubscription />} />
          <Route path="/seller/support" element={<SellerSupport />} />
          <Route path="/customer" element={<CustomerBrowse />} />
          <Route path="/customer/:category" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
