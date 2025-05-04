
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { maintenanceRequests } from "@/lib/mock-data";
import { MaintenanceRequest } from "@/types/property";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Image, FileUp, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TenantMaintenance = () => {
  // For demo, we'll filter to only show requests for tenant 001
  const [requests, setRequests] = useState<MaintenanceRequest[]>(
    maintenanceRequests.filter(req => req.tenantId === "tenant-001")
  );
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newRequest: MaintenanceRequest = {
      id: `maintenance-${Date.now()}`,
      flatId: "flat-001",
      tenantId: "tenant-001",
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      status: "received",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Request Submitted",
      description: "Your maintenance request has been submitted successfully.",
    });
    
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
    });
  };

  const openImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  // Mock function to simulate image upload
  const handleImageUpload = () => {
    // In a real app, we'd use a file input and upload to a server
    const mockImageUrl = "https://images.unsplash.com/photo-1581275233365-afb02e5d39cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    setFormData(prev => ({ ...prev, imageUrl: mockImageUrl }));
    
    toast({
      title: "Image Uploaded",
      description: "Your image has been uploaded successfully.",
    });
  };

  return (
    <DashboardLayout title="Maintenance Request" subtitle="Submit and track your maintenance requests">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Requests</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-rentflow-primary hover:bg-rentflow-secondary"
        >
          New Request
        </Button>
      </div>

      <div className="grid gap-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id}>
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
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-500">{request.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  {request.imageUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-rentflow-primary"
                      onClick={() => openImageDialog(request.imageUrl || "")}
                    >
                      <Image className="mr-1 h-4 w-4" />
                      View Image
                    </Button>
                  )}
                </div>
                <div className="mt-2 pt-2">
                  {request.status === "received" ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Clock className="h-4 w-4" />
                      We've received your request and will attend to it shortly.
                    </div>
                  ) : request.status === "in_progress" ? (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <Clock className="h-4 w-4" />
                      Your request is currently being worked on.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      This issue has been resolved.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Clock className="mb-2 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No maintenance requests yet</p>
              <p className="mt-1 text-xs text-gray-400">
                Submit a request for any maintenance issues in your flat.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Maintenance Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Issue Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Leaking Faucet, AC Not Working"
                className="rentflow-input"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe the issue in detail"
                className="min-h-[100px] rentflow-input"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach Image (Optional)</label>
              
              {formData.imageUrl ? (
                <div className="relative mt-2 overflow-hidden rounded-lg border">
                  <img
                    src={formData.imageUrl}
                    alt="Uploaded preview"
                    className="h-48 w-full object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleImageUpload}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              Submit Request
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

export default TenantMaintenance;
