
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications, payments, tenantData, flatsData, maintenanceRequests } from "@/lib/mock-data";
import { Home, FileText, Bell, ArrowRight, DollarSign, Calendar, Check } from "lucide-react";
import { Link } from "react-router-dom";

const TenantDashboard = () => {
  // For demo purposes, we'll use the first tenant
  const tenant = tenantData[0];
  const flat = flatsData.find((f) => f.id === tenant.flatId);
  
  // Get the latest payment
  const latestPayment = payments.find((p) => p.tenantId === tenant.id && p.status === "pending");
  
  // Calculate total charges
  const totalCharges = flat ? 
    flat.rent + flat.maintenanceCost + flat.serviceCharge + 
    flat.elevatorFee + flat.securityCharge + flat.societyFee : 0;

  // Get tenant's maintenance requests
  const tenantRequests = maintenanceRequests.filter(
    (req) => req.tenantId === tenant.id
  );

  return (
    <DashboardLayout 
      title="Tenant Dashboard" 
      subtitle={`Welcome back, ${tenant.name}`}
    >
      {/* Welcome Card */}
      <Card className="border-l-4 border-l-rentflow-primary mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-medium">Welcome to HRMS</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your rental management dashboard for {flat?.name} (#{flat?.number})
              </p>
            </div>
            {latestPayment && (
              <div className="mt-4 sm:mt-0 flex items-center p-2 bg-yellow-50 text-yellow-700 text-sm rounded-lg">
                <Bell size={16} className="mr-2" />
                <span>Payment for {latestPayment.month} is due</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <Home className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${flat?.rent}</div>
            <p className="text-xs text-muted-foreground">Due on the 1st of every month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Charges</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCharges}</div>
            <p className="text-xs text-muted-foreground">
              Including all fees and charges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestPayment ? latestPayment.month : "All paid"}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestPayment ? "Payment pending" : "No pending payments"}
            </p>
            {latestPayment && (
              <Button className="mt-2 h-8 w-full bg-rentflow-primary hover:bg-rentflow-secondary">
                Pay Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Recent Notifications */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Link 
              to="/tenant" 
              className="text-sm text-rentflow-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className={`rounded-full p-2 ${
                  notification.type === "bill" 
                    ? "bg-blue-100 text-blue-600" 
                    : notification.type === "maintenance" 
                      ? "bg-yellow-100 text-yellow-600" 
                      : "bg-green-100 text-green-600"
                }`}>
                  {notification.type === "bill" ? (
                    <DollarSign size={16} />
                  ) : notification.type === "maintenance" ? (
                    <Home size={16} />
                  ) : (
                    <Bell size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/tenant/billing">
              <Button variant="outline" className="w-full justify-between text-left">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>View Billing Details</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/tenant/documents">
              <Button variant="outline" className="w-full justify-between text-left">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Upload Documents</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/tenant/maintenance">
              <Button variant="outline" className="w-full justify-between text-left">
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Submit Maintenance Request</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantRequests.length > 0 ? (
              tenantRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-gray-500">{request.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      request.status === "received" 
                        ? "bg-blue-100 text-blue-800" 
                        : request.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}>
                      {request.status === "received" 
                        ? "Received" 
                        : request.status === "in_progress"
                          ? "In Progress"
                          : "Completed"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-gray-500">No maintenance requests submitted</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TenantDashboard;
