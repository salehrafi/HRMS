
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { maintenanceRequests, flatsData, tenantData } from "@/lib/mock-data";
import { MaintenanceRequest, MaintenanceStatus } from "@/types/property";
import { Circle, CheckCircle, ArrowRight, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminMaintenance = () => {
  const [requests, setRequests] = useState(maintenanceRequests);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { toast } = useToast();
  
  const handleStatusChange = (status: MaintenanceStatus) => {
    if (!selectedRequest) return;
    
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status, updatedAt: new Date().toISOString() }
          : req
      )
    );
    
    setIsDialogOpen(false);
    
    toast({
      title: "Status Updated",
      description: `Maintenance request status updated to ${
        status === "received" ? "Received" : status === "in_progress" ? "In Progress" : "Done"
      }.`,
    });
  };

  const openUpdateDialog = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const openImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  // Filter requests by status
  const receivedRequests = requests.filter((r) => r.status === "received");
  const inProgressRequests = requests.filter((r) => r.status === "in_progress");
  const doneRequests = requests.filter((r) => r.status === "done");

  // Render a single request card
  const renderRequestCard = (request: MaintenanceRequest) => {
    const tenant = tenantData.find(t => t.id === request.tenantId);
    const flat = flatsData.find(f => f.id === request.flatId);
    
    return (
      <Card key={request.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{request.title}</CardTitle>
          <Badge
            className={
              request.status === "received"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : request.status === "in_progress"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : "bg-green-100 text-green-800 hover:bg-green-100"
            }
          >
            {request.status === "received"
              ? "Received"
              : request.status === "in_progress"
              ? "In Progress"
              : "Completed"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">{request.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs font-medium">
                {flat?.name} (#{flat?.number}) - {tenant?.name}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {request.imageUrl && (
              <button
                onClick={() => openImageDialog(request.imageUrl || "")}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                <Image size={12} />
                View Image
              </button>
            )}
            
            {request.status !== "done" && (
              <Button 
                size="sm" 
                onClick={() => openUpdateDialog(request)}
                className="ml-auto bg-rentflow-primary hover:bg-rentflow-secondary"
              >
                Update Status
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout title="Maintenance Requests" subtitle="Manage property maintenance issues">
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="relative">
            Received
            {receivedRequests.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rentflow-primary text-xs text-white">
                {receivedRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="relative">
            In Progress
            {inProgressRequests.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rentflow-primary text-xs text-white">
                {inProgressRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-6 space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map(renderRequestCard)
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Circle className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No new maintenance requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-6 space-y-4">
          {inProgressRequests.length > 0 ? (
            inProgressRequests.map(renderRequestCard)
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ArrowRight className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No requests in progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6 space-y-4">
          {doneRequests.length > 0 ? (
            doneRequests.map(renderRequestCard)
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No completed maintenance requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Change the status of this maintenance request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="font-medium">{selectedRequest?.title}</p>
            <p className="text-sm text-gray-500">{selectedRequest?.description}</p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedRequest?.status === "received"
                    ? "bg-blue-100 text-blue-800"
                    : selectedRequest?.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {selectedRequest?.status === "received"
                  ? "Received"
                  : selectedRequest?.status === "in_progress"
                  ? "In Progress"
                  : "Done"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select 
                defaultValue={selectedRequest?.status}
                onValueChange={(value) => handleStatusChange(value as MaintenanceStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
              onClick={() => {
                const select = document.querySelector("select") as HTMLSelectElement;
                if (select && select.value) {
                  handleStatusChange(select.value as MaintenanceStatus);
                }
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Maintenance Request Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Maintenance request"
                className="max-h-[400px] rounded-lg object-contain"
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsImageDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminMaintenance;
