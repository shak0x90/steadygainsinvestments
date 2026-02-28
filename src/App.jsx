import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ValueProposition from '@/components/ValueProposition';
import PlansSection from '@/components/PlansSection';
import TrackRecord from '@/components/TrackRecord';
import Team from '@/components/Team';
import News from '@/components/News';
import ContactFooter from '@/components/ContactFooter';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import TermsAndConditions from '@/pages/TermsAndConditions';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import InvestmentPlans from '@/pages/dashboard/InvestmentPlans';
import Portfolio from '@/pages/dashboard/Portfolio';
import Transactions from '@/pages/dashboard/Transactions';
import Settings from '@/pages/dashboard/Settings';
import Withdraw from '@/pages/dashboard/Withdraw';
import Support from '@/pages/dashboard/Support';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminPlans from '@/pages/admin/AdminPlans';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminContent from '@/pages/admin/AdminContent';
import AdminUserDetail from '@/pages/admin/AdminUserDetail';
import AdminModifications from '@/pages/admin/AdminModifications';
import AdminTickets from '@/pages/admin/AdminTickets';
import AdminSettings from '@/pages/admin/AdminSettings';

function LandingPage() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Navbar />
        <Hero />
        <About />
        <ValueProposition />
        <PlansSection />
        <TrackRecord />
        <Team />
        <News />
        <ContactFooter />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Public Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="plans" element={<InvestmentPlans />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="requests" element={<AdminModifications />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
