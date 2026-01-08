import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UsersPage from "./pages/UsersPage";
import AIPerformancePage from "./pages/AIPerformancePage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SixPointsPage from "./pages/SixPointsPage";
import EmailPage from "./pages/EmailPage";
import NotFound from "./pages/NotFound";
import UserDetail from "./pages/UserDetail";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/Dashboard" element={<Index />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/ai-performance" element={<AIPerformancePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/xp-points" element={<SixPointsPage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/user-detail" element={<UserDetail />} />
         <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
