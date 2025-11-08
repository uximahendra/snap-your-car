import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import Auth from "./pages/Auth";
import MyCars from "./pages/MyCars";
import Capture from "./pages/Capture";
import Processing from "./pages/Processing";
import AngleReview from "./pages/AngleReview";
import View360 from "./pages/View360";
import EnhanceMulti from "./pages/EnhanceMulti";
import SessionDetail from "./pages/SessionDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BackgroundRemovalProcessing from "./pages/BackgroundRemovalProcessing";
import ShowroomSelection from "./pages/ShowroomSelection";

const queryClient = new QueryClient();

const AppContent = () => {
  useTheme(); // Initialize theme
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/my-cars" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/my-cars" element={<MyCars />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/angle-review" element={<AngleReview />} />
        <Route path="/view-360" element={<View360 />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/enhance-multi" element={<EnhanceMulti />} />
        <Route path="/background-removal-processing" element={<BackgroundRemovalProcessing />} />
        <Route path="/showroom-selection" element={<ShowroomSelection />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
