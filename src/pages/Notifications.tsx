import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, Info, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Notifications = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Booking Confirmed",
      description: "Your booking for Computer Lab A on Jan 15, 2025 at 2:00 PM has been confirmed.",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Booking Reminder",
      description: "Your reservation for Computer Lab A starts in 1 hour.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Pending Confirmation",
      description: "Your booking for Projector on Jan 17 is awaiting approval.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 4,
      type: "destructive",
      title: "Booking Cancelled",
      description: "Your booking for Classroom 101 on Jan 8 has been cancelled.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: "Booking Confirmed",
      description: "Your booking for Conference Room B on Jan 16 at 10:00 AM has been confirmed.",
      time: "2 days ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      case "warning":
        return <Clock className="h-5 w-5 text-warning" />;
      case "destructive":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/10 border-success/20";
      case "info":
        return "bg-primary/10 border-primary/20";
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "destructive":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your bookings</p>
        </div>

        <div className="max-w-3xl space-y-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={`p-6 border-2 transition-all animate-scale-in ${
                notification.read ? "opacity-60" : ""
              } ${getColorClass(notification.type)}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">
                    {notification.description}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
