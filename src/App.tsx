import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import Profiles from "./pages/Profiles";
import Health from "./pages/Health";
import Training from "./pages/Training";
import Grooming from "./pages/Grooming";
import Vets from "./pages/Vets";
import Account from "./pages/Account";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<LoadingFallback />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/health" element={<Health />} />
              <Route path="/training" element={<Training />} />
              <Route path="/grooming" element={<Grooming />} />
              <Route path="/vets" element={<Vets />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;