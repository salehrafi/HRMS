
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { flatsData, payments, tenantData } from "@/lib/mock-data";
import { Payment } from "@/types/property";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, CheckCircle, AlertCircle, Clock } from "lucide-react";

const TenantBilling = () => {
  // For demo, we'll use the first tenant and their flat
  const tenant = tenantData[0];
  const flat = flatsData.find(f => f.id === tenant.flatId);
  const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const { toast } = useToast();
  
  // Calculate total charges
  const totalCharges = flat ? 
    flat.rent + flat.maintenanceCost + flat.serviceCharge + 
    flat.elevatorFee + flat.securityCharge + flat.societyFee : 0;
  
  const openPaymentDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };
  
  const handlePayment = () => {
    if (!selectedPayment) return;
    
    const updatedPayment = {
      ...selectedPayment,
      method: paymentMethod,
      date: new Date().toISOString(),
      status: "paid" as const,
    };
    
    // Replace the payment in the array
    const updatedPayments = tenantPayments.map(p => 
      p.id === selectedPayment.id ? updatedPayment : p
    );
    
    // In a real app, we'd update this in a database
    
    toast({
      title: "Payment Successful",
      description: paymentMethod === "online" 
        ? "Your payment has been processed successfully." 
        : "Cash payment notification sent to admin.",
    });
    
    setIsDialogOpen(false);
    
    // Force a re-render by updating state
    if (paymentMethod === "online") {
      // This would be a proper state update in a real app
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <DashboardLayout title="Flat Info & Billing" subtitle="View rent details and payment history">
      {/* Rent Breakdown Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rent Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span>Base Rent</span>
              <span className="font-medium">${flat?.rent}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Maintenance Cost</span>
              <span className="font-medium">${flat?.maintenanceCost}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Service Charge</span>
              <span className="font-medium">${flat?.serviceCharge}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Elevator Fee</span>
              <span className="font-medium">${flat?.elevatorFee}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Security Charge</span>
              <span className="font-medium">${flat?.securityCharge}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Society Fee</span>
              <span className="font-medium">${flat?.societyFee}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${totalCharges}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {payment.month} {payment.year}
                    </span>
                    {payment.status === "paid" ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Paid
                      </span>
                    ) : payment.status === "overdue" ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Overdue
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {payment.status === "paid" 
                      ? `Paid on ${new Date(payment.date).toLocaleDateString()} via ${
                          payment.method === "online" ? "Online Payment" : "Cash"
                        }` 
                      : `Amount: $${payment.amount}`}
                  </p>
                </div>
                
                <div>
                  {payment.status === "pending" && (
                    <Button 
                      onClick={() => openPaymentDialog(payment)}
                      className="bg-rentflow-primary hover:bg-rentflow-secondary"
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {tenantPayments.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-gray-500">No payment history available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">
                {selectedPayment?.month} {selectedPayment?.year} Rent
              </p>
              <p className="text-sm text-gray-500">
                Total Amount: ${selectedPayment?.amount}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Payment Method</p>
              <RadioGroup 
                defaultValue={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as "online" | "cash")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-lg border p-3 transition-all hover:bg-gray-50">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Online Payment (Card/SSLCommerz)</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-lg border p-3 transition-all hover:bg-gray-50">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Cash Payment</span>
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "cash" && (
                <p className="mt-2 text-xs text-gray-500">
                  Selecting cash payment will notify the property manager to collect the payment.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              {paymentMethod === "online" ? "Pay Now" : "Notify Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TenantBilling;
