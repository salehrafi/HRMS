
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/user";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState(notifications);
  const { userType } = useAuth();
  const navigate = useNavigate();
  
  const unreadCount = notificationsData.filter((notification) => !notification.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    setNotificationsData((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate to relevant page based on notification type and user type
    if (userType === "admin") {
      if (notification.type === "bill") {
        navigate("/admin/flats");
      } else if (notification.type === "maintenance") {
        navigate("/admin/maintenance");
      } else {
        navigate("/admin/notifications");
      }
    } else {
      if (notification.type === "bill") {
        navigate("/tenant/billing");
      } else if (notification.type === "maintenance") {
        navigate("/tenant/maintenance");
      } else {
        navigate("/tenant");
      }
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    return (
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          type === "bill"
            ? "bg-blue-100 text-blue-600"
            : type === "maintenance"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        )}
      >
        <Bell size={16} />
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">Notifications</h3>
          <span className="text-xs text-muted-foreground">
            {unreadCount} unread
          </span>
        </div>
        <ScrollArea className="h-[300px]">
          {notificationsData.length > 0 ? (
            <div className="divide-y">
              {notificationsData.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-4 p-4 hover:bg-accent",
                    !notification.read && "bg-muted"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <p className="text-center text-sm text-muted-foreground">
                No notifications
              </p>
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            onClick={() => {
              navigate(userType === "admin" ? "/admin/notifications" : "/tenant");
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
