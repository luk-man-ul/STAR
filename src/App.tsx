import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, AppLayout, ProtectedRoute, LoadingSpinner } from './components';
import {
  HomePage,
  MyOrdersPage,
  BookingPage,
  LoginPage,
  AccountPage,
  AdminDashboardPage,
  AdminOrdersPage,
  CustomersPage,
  ServicesPage,
  CallUsPage,
  LocateShopPage,
  NotFoundPage
} from './pages';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/call-us" element={<CallUsPage />} />
          
          {/* Customer routes - require authentication */}
          <Route path="/my-orders" element={
            <ProtectedRoute requiredRole="customer">
              <MyOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/book" element={
            <ProtectedRoute requiredRole="customer">
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/locate" element={
            <ProtectedRoute requiredRole="customer">
              <LocateShopPage />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute requiredRole="customer">
              <AccountPage />
            </ProtectedRoute>
          } />
          
          {/* Admin routes - require admin role */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute requiredRole="admin">
              <CustomersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute requiredRole="admin">
              <ServicesPage />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;