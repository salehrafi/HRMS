
import { User, Admin, Tenant, UserType } from "@/types/user";

class UserService {
  private readonly ADMIN_KEY = "hrms_admins";
  private readonly TENANT_KEY = "hrms_tenants";
  private readonly CURRENT_USER_KEY = "hrms_current_user";

  // Get all admins from local storage
  getAdmins(): Admin[] {
    const admins = localStorage.getItem(this.ADMIN_KEY);
    return admins ? JSON.parse(admins) : [];
  }

  // Get all tenants from local storage
  getTenants(): Tenant[] {
    const tenants = localStorage.getItem(this.TENANT_KEY);
    return tenants ? JSON.parse(tenants) : [];
  }

  // Save admin to local storage
  saveAdmin(admin: Admin): Admin {
    const admins = this.getAdmins();
    const existingAdminIndex = admins.findIndex(a => a.email === admin.email);
    
    if (existingAdminIndex >= 0) {
      // Update existing admin
      admins[existingAdminIndex] = admin;
    } else {
      // Add new admin
      admins.push(admin);
    }
    
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admins));
    return admin;
  }

  // Save tenant to local storage
  saveTenant(tenant: Tenant): Tenant {
    const tenants = this.getTenants();
    const existingTenantIndex = tenants.findIndex(t => t.id === tenant.id || t.loginCode === tenant.loginCode);
    
    if (existingTenantIndex >= 0) {
      // Update existing tenant
      tenants[existingTenantIndex] = tenant;
    } else {
      // Add new tenant
      tenants.push(tenant);
    }
    
    localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenants));
    return tenant;
  }

  // Register a new admin
  registerAdmin(name: string, email: string, phone: string, password: string): Admin {
    const id = `admin-${Date.now()}`;
    const admin: Admin = { id, name, email, phone, role: "admin", password };
    return this.saveAdmin(admin);
  }

  // Register a new tenant
  registerTenant(name: string, email: string, phone: string, flatId: string): Tenant {
    const id = `tenant-${Date.now()}`;
    // Generate a random 6-digit login code
    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tenant: Tenant = { id, name, email, phone, flatId, loginCode };
    return this.saveTenant(tenant);
  }

  // Check admin login credentials
  loginAdmin(email: string, password: string): Admin | null {
    const admins = this.getAdmins();
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
      this.setCurrentUser({ id: admin.id, type: 'admin' });
    }
    
    return admin || null;
  }

  // Login tenant by login code
  loginTenant(loginCode: string): Tenant | null {
    const tenants = this.getTenants();
    const tenant = tenants.find(t => t.loginCode === loginCode);
    
    if (tenant) {
      this.setCurrentUser({ id: tenant.id, type: 'tenant' });
    }
    
    return tenant || null;
  }

  // Set current logged-in user
  private setCurrentUser(user: { id: string; type: UserType }): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Get current logged-in user
  getCurrentUser(): { id: string; type: UserType } | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Clear current user (logout)
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Update user password
  updatePassword(userType: UserType, userId: string, newPassword: string): boolean {
    if (userType === 'admin') {
      const admins = this.getAdmins();
      const adminIndex = admins.findIndex(a => a.id === userId);
      
      if (adminIndex >= 0) {
        admins[adminIndex].password = newPassword;
        localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admins));
        return true;
      }
    }
    // For tenants, we don't store passwords since they use login codes
    return false;
  }

  // Update user profile
  updateUserProfile(userType: UserType, userId: string, updates: Partial<Admin | Tenant>): boolean {
    if (userType === 'admin') {
      const admins = this.getAdmins();
      const adminIndex = admins.findIndex(a => a.id === userId);
      
      if (adminIndex >= 0) {
        admins[adminIndex] = { ...admins[adminIndex], ...updates };
        localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admins));
        return true;
      }
    } else {
      const tenants = this.getTenants();
      const tenantIndex = tenants.findIndex(t => t.id === userId);
      
      if (tenantIndex >= 0) {
        tenants[tenantIndex] = { ...tenants[tenantIndex], ...updates };
        localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenants));
        return true;
      }
    }
    
    return false;
  }
}

export const userService = new UserService();
