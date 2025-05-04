
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { flatsData, tenantData } from "@/lib/mock-data";
import { Flat, FlatStatus } from "@/types/property";
import { Copy, Edit, Plus, Trash, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AdminFlats = () => {
  const [flats, setFlats] = useState(flatsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedLoginCode, setSelectedLoginCode] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Flat>>({
    name: "",
    number: "",
    floor: "",
    area: "",
    rent: 0,
    maintenanceCost: 0,
    serviceCharge: 0,
    elevatorFee: 0,
    securityCharge: 0,
    societyFee: 0,
    status: "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Cost") || name.includes("Fee") || name === "rent" || name === "securityCharge" || name === "societyFee" || name === "serviceCharge"
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleStatusChange = (status: FlatStatus) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const openDialog = (flat?: Flat) => {
    if (flat) {
      setSelectedFlat(flat);
      setFormData({ ...flat });
    } else {
      setSelectedFlat(null);
      setFormData({
        name: "",
        number: "",
        floor: "",
        area: "",
        rent: 0,
        maintenanceCost: 0,
        serviceCharge: 0,
        elevatorFee: 0,
        securityCharge: 0,
        societyFee: 0,
        status: "available",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.number) {
      toast({
        title: "Error",
        description: "Flat name and number are required.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFlat) {
      // Editing existing flat
      setFlats((prev) =>
        prev.map((f) => (f.id === selectedFlat.id ? { ...f, ...formData } : f))
      );
      toast({
        title: "Flat Updated",
        description: `Flat ${formData.name} has been updated.`,
      });
    } else {
      // Adding new flat
      const newFlat: Flat = {
        id: `flat-${Date.now()}`,
        ...formData as Flat,
        loginCode: `${Math.floor(100000 + Math.random() * 900000)}`,
      };
      setFlats((prev) => [...prev, newFlat]);
      toast({
        title: "Flat Added",
        description: `Flat ${formData.name} has been added.`,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (flatId: string) => {
    setFlats((prev) => prev.filter((f) => f.id !== flatId));
    toast({
      title: "Flat Deleted",
      description: "The flat has been deleted successfully.",
    });
  };

  const openEmailDialog = (flat: Flat) => {
    setSelectedLoginCode(flat.loginCode || "");
    const tenant = tenantData.find(t => t.id === flat.tenantId);
    setSelectedTenant(tenant?.name || "");
    setIsEmailDialogOpen(true);
  };

  const handleSendCode = () => {
    toast({
      title: "Code Sent",
      description: `Login code has been sent to ${selectedTenant}.`,
    });
    setIsEmailDialogOpen(false);
  };

  const copyLoginCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Login code copied to clipboard.",
    });
  };

  return (
    <DashboardLayout title="Flat Management" subtitle="Manage your property units">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flat List</h2>
        <Button 
          onClick={() => openDialog()} 
          className="bg-rentflow-primary hover:bg-rentflow-secondary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Flat
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flats.map((flat) => (
                <TableRow key={flat.id}>
                  <TableCell className="font-medium">{flat.name}</TableCell>
                  <TableCell>{flat.number}</TableCell>
                  <TableCell>{flat.floor}</TableCell>
                  <TableCell>${flat.rent}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        flat.status === "available"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {flat.status === "available" ? "Available" : "Booked"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {flat.loginCode ? (
                      <div className="flex items-center gap-2">
                        <span>{flat.loginCode}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyLoginCode(flat.loginCode || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {flat.status === "booked" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEmailDialog(flat)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(flat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(flat.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Flat Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFlat ? "Edit Flat" : "Add New Flat"}
            </DialogTitle>
            <DialogDescription>
              {selectedFlat
                ? "Update the flat information below"
                : "Enter the flat details below to add a new flat"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Flat Details</TabsTrigger>
              <TabsTrigger value="charges">Charges & Fees</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Flat Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="number" className="text-sm font-medium">
                    Flat Number
                  </label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="floor" className="text-sm font-medium">
                    Floor
                  </label>
                  <Input
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="area" className="text-sm font-medium">
                    Area (sqft)
                  </label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: FlatStatus) => handleStatusChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="rent" className="text-sm font-medium">
                  Monthly Rent ($)
                </label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  value={formData.rent?.toString()}
                  onChange={handleChange}
                  className="rentflow-input"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="charges" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="maintenanceCost" className="text-sm font-medium">
                    Maintenance Cost ($)
                  </label>
                  <Input
                    id="maintenanceCost"
                    name="maintenanceCost"
                    type="number"
                    value={formData.maintenanceCost?.toString()}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="serviceCharge" className="text-sm font-medium">
                    Service Charge ($)
                  </label>
                  <Input
                    id="serviceCharge"
                    name="serviceCharge"
                    type="number"
                    value={formData.serviceCharge?.toString()}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="elevatorFee" className="text-sm font-medium">
                    Elevator Fee ($)
                  </label>
                  <Input
                    id="elevatorFee"
                    name="elevatorFee"
                    type="number"
                    value={formData.elevatorFee?.toString()}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="securityCharge" className="text-sm font-medium">
                    Security Charge ($)
                  </label>
                  <Input
                    id="securityCharge"
                    name="securityCharge"
                    type="number"
                    value={formData.securityCharge?.toString()}
                    onChange={handleChange}
                    className="rentflow-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="societyFee" className="text-sm font-medium">
                  Society Fee ($)
                </label>
                <Input
                  id="societyFee"
                  name="societyFee"
                  type="number"
                  value={formData.societyFee?.toString()}
                  onChange={handleChange}
                  className="rentflow-input"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              {selectedFlat ? "Save Changes" : "Add Flat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Login Code Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Send Login Code</DialogTitle>
            <DialogDescription>
              Send the tenant's login code via Email/SMS.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Login Code</label>
              <Input value={selectedLoginCode} disabled className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tenant</label>
              <Input value={selectedTenant} disabled className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Via</label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendCode}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              Send Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminFlats;
