import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Capture from "./pages/Capture";
import Processing from "./pages/Processing";
import AngleReview from "./pages/AngleReview";
import View360 from "./pages/View360";
import EnhanceMulti from "./pages/EnhanceMulti";
import Gallery from "./pages/Gallery";
import GallerySession from "./pages/GallerySession";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useTheme(); // Initialize theme
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/angle-review" element={<AngleReview />} />
        <Route path="/view-360" element={<View360 />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/enhance-multi" element={<EnhanceMulti />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<GallerySession />} />
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
