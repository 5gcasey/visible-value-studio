import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import MeetingsPage from "./pages/MeetingsPage";
import OfficialsPage from "./pages/OfficialsPage";
import OfficialProfilePage from "./pages/OfficialProfilePage";
import IssuesPage from "./pages/IssuesPage";
import DevelopersPage from "./pages/DevelopersPage";
import ReportsPage, { ReportDetailPage } from "./pages/ReportsPage";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import SubscribePage from "./pages/SubscribePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/officials" element={<OfficialsPage />} />
          <Route path="/officials/:slug" element={<OfficialProfilePage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
