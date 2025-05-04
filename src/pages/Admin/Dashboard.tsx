
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flatsData, maintenanceRequests, tenantData } from "@/lib/mock-data";
import { Building, Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Calculate stats
  const totalFlats = flatsData.length;
  const occupiedFlats = flatsData.filter((flat) => flat.status === "booked").length;
  const occupancyRate = Math.round((occupiedFlats / totalFlats) * 100);
  const pendingMaintenance = maintenanceRequests.filter(
    (req) => req.status !== "done"
  ).length;

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Welcome back to your property management dashboard"
    >
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlats}</div>
            <p className="text-xs text-muted-foreground">
              {occupiedFlats} occupied, {totalFlats - occupiedFlats} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-hrms-primary"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantData.length}</div>
            <p className="text-xs text-muted-foreground">
              {tenantData.length} active tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${flatsData.reduce((acc, flat) => acc + (flat.status === "booked" ? flat.rent : 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {occupiedFlats} occupied flats
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Building size={16} />
              </div>
              <div>
                <p className="font-medium">New Tenant Assigned</p>
                <p className="text-sm text-gray-500">Sabbir Hossain was assigned to Flat #202</p>
                <p className="mt-1 text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <DollarSign size={16} />
              </div>
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-gray-500">Niha paid $1500 for April rent</p>
                <p className="mt-1 text-xs text-gray-400">3 days ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="font-medium">Maintenance Request</p>
                <p className="text-sm text-gray-500">New request for AC repair in Flat #202</p>
                <p className="mt-1 text-xs text-gray-400">4 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Issues */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Maintenance</CardTitle>
            <Link 
              to="/admin/maintenance"
              className="text-sm text-hrms-primary hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceRequests
              .filter((req) => req.status !== "done")
              .map((request) => {
                const tenant = tenantData.find(t => t.id === request.tenantId);
                const flat = flatsData.find(f => f.id === request.flatId);
                
                return (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-gray-500">
                        {flat?.name} (#{flat?.number}) - {tenant?.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        request.status === "received" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {request.status === "received" ? "New" : "In Progress"}
                      </span>
                    </div>
                  </div>
                );
              })}

            {maintenanceRequests.filter((req) => req.status !== "done").length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-gray-500">No pending maintenance requests</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
