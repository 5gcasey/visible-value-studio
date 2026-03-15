import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
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
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/DashboardPage";
import AdminMeetingsPage from "./pages/admin/AdminMeetingsPage";
import AdminOfficialsPage from "./pages/admin/AdminOfficialsPage";
import AdminIssuesPage from "./pages/admin/AdminIssuesPage";
import AdminDevelopersPage from "./pages/admin/AdminDevelopersPage";
import AdminAlertsPage from "./pages/admin/AdminAlertsPage";
import AdminSubscribersPage from "./pages/admin/AdminSubscribersPage";
import AdminCommunityPage from "./pages/admin/AdminCommunityPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminGramaPage from "./pages/admin/AdminGramaPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="meetings" element={<AdminMeetingsPage />} />
              <Route path="officials" element={<AdminOfficialsPage />} />
              <Route path="issues" element={<AdminIssuesPage />} />
              <Route path="developers" element={<AdminDevelopersPage />} />
              <Route path="alerts" element={<AdminAlertsPage />} />
              <Route path="subscribers" element={<AdminSubscribersPage />} />
              <Route path="community" element={<AdminCommunityPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="grama" element={<AdminGramaPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
