import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/App";
import { userService } from "@/services/UserService";
import { Mail, Lock, User } from "lucide-react";
import { tenantData, adminData } from "@/lib/mock-data";


// Load mock data if localStorage is empty
// import { tenantData } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/ThemeToggle";

const Login = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "tenant">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize database with mock data if empty
  // const initializeData = () => {
  //   // Check if we already have tenants, if not, initialize with mock data
  //   const existingTenants = userService.getTenants();
  //   if (existingTenants.length === 0) {
  //     tenantData.forEach(tenant => {
  //       userService.saveTenant(tenant);
  //     });
  //   }

  //   // Add a default admin if none exists
  //   const existingAdmins = userService.getAdmins();
  //   if (existingAdmins.length === 0) {
  //     userService.registerAdmin(
  //       "Mr. X", 
  //       "admin@hrms.com", 
  //       "+880 123-4567", 
  //       "password"
  //     );
  //   }
  // };

  const initializeData = () => {
    // Initialize tenant data if not already present
    const existingTenants = userService.getTenants();
    if (existingTenants.length === 0) {
      tenantData.forEach((tenant) => {
        userService.saveTenant(tenant);
      });
    }

    // Initialize admin data if not already present
    const existingAdmins = userService.getAdmins();
    if (existingAdmins.length === 0) {
      // Assuming adminData is imported from mock-data.ts and has full admin info
      userService.saveAdmin(adminData); // Make sure saveAdmin exists in userService
    }
  };

  initializeData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "admin") {
      // Simple validation
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return;
      }

      // Try to login admin
      const admin = userService.loginAdmin(email, password);
      if (admin) {
        login("admin");
        navigate("/admin");
        toast({
          title: "Success",
          description: `Welcome back, ${admin.name}!`,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } else {
      // Simple validation for tenant
      if (!loginCode) {
        toast({
          title: "Error",
          description: "Please enter your login code",
          variant: "destructive",
        });
        return;
      }

      // Try to login tenant
      const tenant = userService.loginTenant(loginCode);
      if (tenant) {
        login("tenant");
        navigate("/tenant");
        toast({
          title: "Success",
          description: `Welcome back, ${tenant.name}!`,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid login code",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">HRMS</h1>
          <p className="mt-2 text-muted-foreground">Home Rent Management System</p>
        </div>

        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="hrms-card p-6 shadow-md rounded-lg">
          {/* Toggle Buttons */}
          <div className="mb-6 flex rounded-full bg-accent p-1">
            <button
              className={`flex-1 rounded-full py-2 text-sm font-medium ${activeTab === "admin" ? "toggle-button-active" : "toggle-button-inactive"
                }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Login
            </button>
            <button
              className={`flex-1 rounded-full py-2 text-sm font-medium ${activeTab === "tenant" ? "toggle-button-active" : "toggle-button-inactive"
                }`}
              onClick={() => setActiveTab("tenant")}
            >
              Tenant Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {activeTab === "admin" ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rentflow-input"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rentflow-input"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    to="/register"
                    className="text-sm text-primary hover:underline"
                  >
                    Register
                  </Link>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Forgot Password",
                        description: "Password reset feature would open here",
                      });
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label htmlFor="loginCode" className="text-sm font-medium">
                  Login Code
                </label>
                <div className="relative">
                  <Input
                    id="loginCode"
                    type="text"
                    placeholder="Enter your unique login code"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="pl-10 rentflow-input"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the unique code provided by your property manager
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Admin: "admin@hrms.com" || Password: "password"</p>
          <p>Tenant: Use code 123456</p>
          <br />
          <br />
          <footer>
            <p>&copy;May 2025. All rights reserved for CSE347-purpose.<strong></strong></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
