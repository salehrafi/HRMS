
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminProfile from "@/pages/Admin/Profile";
import AdminFlats from "@/pages/Admin/Flats";
import AdminNotifications from "@/pages/Admin/Notifications";
import AdminMaintenance from "@/pages/Admin/Maintenance";
import TenantDashboard from "@/pages/Tenant/Dashboard";
import TenantProfile from "@/pages/Tenant/Profile";
import TenantBilling from "@/pages/Tenant/Billing";
import TenantDocuments from "@/pages/Tenant/Documents";
import TenantMaintenance from "@/pages/Tenant/Maintenance";
import NotFound from "@/pages/NotFound";

// Types
import { UserType } from "@/types/user";

// Context
export type AuthContextType = {
  isAuthenticated: boolean;
  userType: UserType | null;
  login: (userType: UserType) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Create a new query client
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);

  const login = (userType: UserType) => {
    setIsAuthenticated(true);
    setUserType(userType);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={userType === 'admin' ? '/admin' : '/tenant'} />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/admin" />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={isAuthenticated && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/admin/profile" element={isAuthenticated && userType === 'admin' ? <AdminProfile /> : <Navigate to="/login" />} />
                <Route path="/admin/flats" element={isAuthenticated && userType === 'admin' ? <AdminFlats /> : <Navigate to="/login" />} />
                <Route path="/admin/notifications" element={isAuthenticated && userType === 'admin' ? <AdminNotifications /> : <Navigate to="/login" />} />
                <Route path="/admin/maintenance" element={isAuthenticated && userType === 'admin' ? <AdminMaintenance /> : <Navigate to="/login" />} />
                
                {/* Tenant Routes */}
                <Route path="/tenant" element={isAuthenticated && userType === 'tenant' ? <TenantDashboard /> : <Navigate to="/login" />} />
                <Route path="/tenant/profile" element={isAuthenticated && userType === 'tenant' ? <TenantProfile /> : <Navigate to="/login" />} />
                <Route path="/tenant/billing" element={isAuthenticated && userType === 'tenant' ? <TenantBilling /> : <Navigate to="/login" />} />
                <Route path="/tenant/documents" element={isAuthenticated && userType === 'tenant' ? <TenantDocuments /> : <Navigate to="/login" />} />
                <Route path="/tenant/maintenance" element={isAuthenticated && userType === 'tenant' ? <TenantMaintenance /> : <Navigate to="/login" />} />
                
                {/* Redirect from root to login */}
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
