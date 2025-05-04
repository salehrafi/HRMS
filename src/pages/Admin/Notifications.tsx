
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { flatsData, tenantData, notifications } from "@/lib/mock-data";
import { Notification } from "@/types/user";
import { Plus, Bell, Calendar, MessageCircle } from "lucide-react";

const AdminNotifications = () => {
  const [notificationsData, setNotificationsData] = useState(notifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "message",
    recipient: "all",
    specificFlatId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as "bill" | "maintenance" | "message" }));
  };

  const handleRecipientChange = (value: string) => {
    setFormData((prev) => ({ ...prev, recipient: value }));
  };

  const handleFlatChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specificFlatId: value }));
  };

  const handleSend = () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Title and message are required.",
        variant: "destructive",
      });
      return;
    }

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      date: new Date().toISOString(),
      read: false,
      type: formData.type as "bill" | "maintenance" | "message",
    };

    setNotificationsData((prev) => [newNotification, ...prev]);
    
    const recipientText = formData.recipient === "all" 
      ? "all tenants" 
      : `tenant of flat ${flatsData.find(f => f.id === formData.specificFlatId)?.number}`;
    
    toast({
      title: "Notification Sent",
      description: `Your notification has been sent to ${recipientText}.`,
    });
    
    setIsDialogOpen(false);
    setFormData({
      title: "",
      message: "",
      type: "message",
      recipient: "all",
      specificFlatId: "",
    });
  };

  return (
    <DashboardLayout title="Notifications" subtitle="Send and manage tenant notifications">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notification Center</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-rentflow-primary hover:bg-rentflow-secondary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notificationsData.map((notification) => (
          <Card key={notification.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {notification.title}
              </CardTitle>
              {notification.type === "bill" ? (
                <Calendar className="h-4 w-4 text-blue-500" />
              ) : notification.type === "maintenance" ? (
                <Bell className="h-4 w-4 text-yellow-500" />
              ) : (
                <MessageCircle className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{notification.message}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    notification.type === "bill"
                      ? "bg-blue-100 text-blue-800"
                      : notification.type === "maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {notification.type === "bill"
                    ? "Bill"
                    : notification.type === "maintenance"
                    ? "Maintenance"
                    : "Message"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Notification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Create a new notification to send to your tenants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Notification Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="rentflow-input"
                placeholder="Enter notification title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="min-h-[100px] rentflow-input"
                placeholder="Enter your notification message"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Notification Type
              </label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bill">Bill Due Reminder</SelectItem>
                  <SelectItem value="maintenance">Maintenance Update</SelectItem>
                  <SelectItem value="message">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Send To
              </label>
              <Select value={formData.recipient} onValueChange={handleRecipientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="specific">Specific Flat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.recipient === "specific" && (
              <div className="space-y-2">
                <label htmlFor="specificFlat" className="text-sm font-medium">
                  Select Flat
                </label>
                <Select value={formData.specificFlatId} onValueChange={handleFlatChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flat" />
                  </SelectTrigger>
                  <SelectContent>
                    {flatsData
                      .filter((flat) => flat.status === "booked")
                      .map((flat) => {
                        const tenant = tenantData.find((t) => t.id === flat.tenantId);
                        return (
                          <SelectItem key={flat.id} value={flat.id}>
                            {flat.name} (#{flat.number}) - {tenant?.name || "Unnamed"}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminNotifications;
