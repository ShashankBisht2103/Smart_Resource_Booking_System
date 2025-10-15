import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, XCircle, BookOpen, ArrowRight, Bell } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";
import ScheduleView from "@/components/ScheduleView";
import TimetableView from "@/components/TimetableView";

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      
      try {
        // Fetch all bookings
        const allBookings = await backend.getBookings();
        
        // Filter bookings for current user and sort by start time
        const userBookings = allBookings
          .filter((booking: any) => booking.user_id === user.id)
          .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        
        setUserBookings(userBookings);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        toast.error("Failed to load your bookings");
      }
    };
    
    if (isAuthenticated && user) {
      fetchUserBookings();
    }
  }, [isAuthenticated, user]);

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
  
  // Calculate stats based on user bookings
  const activeBookings = userBookings.filter(b => b.status === 'confirmed' && new Date(b.start_time) > new Date()).length;
  const nextBooking = userBookings.find(b => b.status === 'confirmed' && new Date(b.start_time) > new Date());
  const cancelledBookings = userBookings.filter(b => b.status === 'cancelled').length;
  const thisMonthBookings = userBookings.filter(b => {
    const bookingDate = new Date(b.start_time);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  }).length;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.user_metadata?.full_name || 'Student'}!</h1>
          <p className="text-muted-foreground">Here's your booking overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: "Active Bookings", value: activeBookings.toString(), color: "text-primary" },
            { icon: Clock, label: "Next Booking", value: nextBooking ? new Date(nextBooking.start_time).toLocaleDateString() : "None", color: "text-accent" },
            { icon: XCircle, label: "Recently Cancelled", value: cancelledBookings.toString(), color: "text-destructive" },
            { icon: Calendar, label: "This Month", value: thisMonthBookings.toString(), color: "text-success" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover-lift cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="p-6 lg:col-span-2 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-6">Today's Schedule</h2>
            <ScheduleView 
              userId={user?.id} 
              date={today} 
              title="" 
              showFilters={false} 
            />
          </Card>

          {/* Timetable for Today */}
          <div className="space-y-6">
            <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-semibold mb-4">Today's Classes</h3>
              <TimetableView 
                title="" 
                showTodayOnly={true}
              />
            </Card>

            {/* Quick Actions & Notifications */}
            <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Recent Notifications</h3>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {[
                  { title: "Booking Confirmed", time: "5 min ago", type: "success" },
                  { title: "Reminder: Lab A at 2 PM", time: "1 hour ago", type: "info" },
                  { title: "Booking Cancelled", time: "2 hours ago", type: "destructive" },
                ].map((notif, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                ))}
                <Link to="/notifications" className="block">
                  <Button variant="link" className="w-full text-primary p-0">
                    View All
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;