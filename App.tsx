import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Customer Components & Pages
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { SupportPage } from './pages/SupportPage';

// Admin Components & Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductManagement } from './admin/ProductManagement';
import { CategoryManagement } from './admin/CategoryManagement';
import { BannerManagement } from './admin/BannerManagement';
import { OrderManagement } from './admin/OrderManagement';
import { InventoryManagement } from './admin/InventoryManagement';
import { CouponManagement } from './admin/CouponManagement';
import { DeliverySettings } from './admin/DeliverySettings';
import { UserManagement } from './admin/UserManagement';
import { GoogleSheetsHub } from './admin/GoogleSheetsHub';
import { WebsiteSettings } from './admin/WebsiteSettings';
import { AuditLogs } from './admin/AuditLogs';

import { MessageCircle } from 'lucide-react';

// Customer layout wrapper with Header, Footer, and Floating WhatsApp
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isAdminPreviewMode, setAdminPreviewMode } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* If admin is previewing customer store, show discreet top return bar */}
      {isAdmin && isAdminPreviewMode && (
        <div className="bg-amber-500 text-emerald-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-xs">
          <span>Viewing Store in "Customer Preview Mode"</span>
          <button
            onClick={() => setAdminPreviewMode(false)}
            className="px-2.5 py-0.5 bg-emerald-950 text-amber-300 rounded text-[11px] hover:bg-emerald-900 cursor-pointer"
          >
            Return to Admin Dashboard
          </button>
        </div>
      )}

      <Header />
      
      <div className="flex-1">
        {children}
      </div>

      <Footer />
      <BottomNav />

      {/* Floating WhatsApp Quick Assistance Button */}
      <a
        href={`https://wa.me/917003735250?text=${encodeURIComponent('Assalamualaikum, I have an enquiry regarding Noor Al Huda Islamic Shop.')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 md:bottom-6 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white/60 cursor-pointer print:hidden group"
        title="Chat with Store Owner on WhatsApp (+91 7003735250)"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      </a>
    </div>
  );
};

// Admin route guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isAuthenticated, isAdminPreviewMode } = useAuth();

  // If user is admin but has enabled Customer Preview mode, allow routing to storefront
  if (isAdmin && isAdminPreviewMode) {
    return <Navigate to="/" replace />;
  }

  // Allow admin access
  if (!isAuthenticated || !isAdmin) {
    // If not authenticated or not admin, redirect to storefront
    return <Navigate to="/" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
                <Route path="/search" element={<CustomerLayout><SearchPage /></CustomerLayout>} />
                <Route path="/category/:id" element={<CustomerLayout><CategoryPage /></CustomerLayout>} />
                <Route path="/product/:id" element={<CustomerLayout><ProductDetailsPage /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
                <Route path="/order-confirmation/:id" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
                <Route path="/orders" element={<CustomerLayout><MyOrdersPage /></CustomerLayout>} />
                <Route path="/orders/:id" element={<CustomerLayout><OrderDetailsPage /></CustomerLayout>} />
                <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />
                <Route path="/account" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
                <Route path="/support" element={<CustomerLayout><SupportPage /></CustomerLayout>} />

                {/* Admin Control Panel Routes */}
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/products" element={<ProtectedAdminRoute><ProductManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/categories" element={<ProtectedAdminRoute><CategoryManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/banners" element={<ProtectedAdminRoute><BannerManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/orders" element={<ProtectedAdminRoute><OrderManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/inventory" element={<ProtectedAdminRoute><InventoryManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/coupons" element={<ProtectedAdminRoute><CouponManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/delivery" element={<ProtectedAdminRoute><DeliverySettings /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><UserManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/google-sheets" element={<ProtectedAdminRoute><GoogleSheetsHub /></ProtectedAdminRoute>} />
                <Route path="/admin/settings" element={<ProtectedAdminRoute><WebsiteSettings /></ProtectedAdminRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedAdminRoute><AuditLogs /></ProtectedAdminRoute>} />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
