import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompareProvider } from "@/state/compare";
import { PreferencesProvider } from "@/state/preferences";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import QuotePage from "./pages/QuotePage";
import QuoteResultPage from "./pages/QuoteResultPage";
import ObituaryPage from "./pages/ObituaryPage";
import ObituaryCreatePage from "./pages/ObituaryCreatePage";
import GuidePage from "./pages/GuidePage";
import OnboardingPage from "./pages/OnboardingPage";
import DetailPage from "./pages/DetailPage";
import CompareTablePage from "./pages/CompareTablePage";
import GuideDetailPage from "./pages/GuideDetailPage";
import ObituaryDetailPage from "./pages/ObituaryDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PreferencesProvider>
      <CompareProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/my" element={<MyPage />} />

                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/quote" element={<QuotePage />} />
                <Route path="/quote/result" element={<QuoteResultPage />} />
                <Route path="/detail/:id" element={<DetailPage />} />
                <Route path="/compare/table" element={<CompareTablePage />} />

                <Route path="/obituary" element={<ObituaryPage />} />
                <Route path="/obituary/create" element={<ObituaryCreatePage />} />
                <Route path="/obituary/:id" element={<ObituaryDetailPage />} />

                <Route path="/guide" element={<GuidePage />} />
                <Route path="/guide/:slug" element={<GuideDetailPage />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          </BrowserRouter>
        </TooltipProvider>
      </CompareProvider>
    </PreferencesProvider>
  </QueryClientProvider>
);

export default App;
