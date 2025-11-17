import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, XCircle, Calendar, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const mockNotifications = [
  { id: 1, type: "booking", title: "New Booking Request", message: "John Doe requested Computer Lab A for 2025-10-05", time: "5 mins ago", read: false },
  { id: 2, type: "cancellation", title: "Booking Cancelled", message: "Mike Johnson cancelled Equipment Room booking", time: "1 hour ago", read: false },
  { id: 3, type: "approval", title: "Booking Approved", message: "Jane Smith's Classroom 301 booking was approved", time: "2 hours ago", read: true },
  { id: 4, type: "error", title: "System Error", message: "Failed to send confirmation email to user", time: "3 hours ago", read: false },
  { id: 5, type: "booking", title: "New Booking Request", message: "Sarah Williams requested Conference Room", time: "5 hours ago", read: true },
  { id: 6, type: "approval", title: "Booking Approved", message: "David Brown's Computer Lab B booking was approved", time: "1 day ago", read: true },
];

const AdminNotifications = () => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

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
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "cancellation":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "approval":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      booking: "default",
      approval: "secondary",
      cancellation: "destructive",
      error: "outline"
    };
    return <Badge variant={variants[type] || "default"}>{type}</Badge>;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-fade-in flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Bell className="h-10 w-10 text-primary" />
                Notifications & Updates
              </h1>
              <p className="text-muted-foreground mt-2">
                System notifications and activity updates
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark All as Read
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Notifications</CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="approval">Approvals</SelectItem>
                    <SelectItem value="cancellation">Cancellations</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    notification.read 
                      ? "bg-background hover:bg-muted/50" 
                      : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {getTypeBadge(notification.type)}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.read && (
                          <Badge variant="destructive" className="text-xs">Unread</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminNotifications;
