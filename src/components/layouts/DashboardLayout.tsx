
import { useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { Menu, X, User, Home, FileText, LayoutDashboard, Settings, LogOut, MessageSquare, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsPopover } from "@/components/NotificationsPopover";

// Types
interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

interface SidebarLink {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const adminLinks: SidebarLink[] = [
    { title: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
    { title: "Personal Info", icon: <User size={18} />, href: "/admin/profile" },
    { title: "Flat Info", icon: <Home size={18} />, href: "/admin/flats" },
    { title: "Notifications", icon: <Bell size={18} />, href: "/admin/notifications" },
    { title: "Maintenance", icon: <Settings size={18} />, href: "/admin/maintenance" },
  ];

  const tenantLinks: SidebarLink[] = [
    { title: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/tenant" },
    { title: "Personal Info", icon: <User size={18} />, href: "/tenant/profile" },
    { title: "Billing", icon: <FileText size={18} />, href: "/tenant/billing" },
    { title: "Documents", icon: <FileText size={18} />, href: "/tenant/documents" },
    { title: "Maintenance", icon: <MessageSquare size={18} />, href: "/tenant/maintenance" },
  ];

  const links = userType === "admin" ? adminLinks : tenantLinks;

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden dark:bg-white/10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card shadow-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-xl font-bold text-primary">HRMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === link.href 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {link.icon}
                <span className="ml-3">{link.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <Button
            variant="outline"
            className="flex w-full items-center justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center lg:hidden">
            <span className="text-lg font-semibold">{title}</span>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <NotificationsPopover />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
