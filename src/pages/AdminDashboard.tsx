import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle, Activity, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";
import ScheduleView from "@/components/ScheduleView";
import TimetableView from "@/components/TimetableView";
import AvailableResourcesViewer from "@/components/AvailableResourcesViewer";

const AdminDashboard = () => {
  const { isAuthenticated, loading, userRole, user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Mock data for chart - in a real app this would come from the backend
  const chartData = [
    { name: "Mon", bookings: 12 },
    { name: "Tue", bookings: 19 },
    { name: "Wed", bookings: 15 },
    { name: "Thu", bookings: 22 },
    { name: "Fri", bookings: 18 },
    { name: "Sat", bookings: 8 },
    { name: "Sun", bookings: 5 },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || userRole !== 'admin') return;
      
      setLoadingBookings(true);
      try {
        // Fetch all bookings from backend
        const allBookings = await backend.getBookings();
        
        // Sort all bookings by start time
        const sortedBookings = [...allBookings].sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        
        // Get the 4 most recent bookings
        const recent = sortedBookings.slice(0, 4);
        setRecentBookings(recent);
        
        // Get upcoming bookings (future bookings)
        const now = new Date();
        const upcoming = sortedBookings
          .filter(booking => new Date(booking.start_time) > now)
          .slice(0, 5);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };
    
    if (isAuthenticated && userRole === 'admin') {
      fetchBookings();
    }
  }, [isAuthenticated, userRole]);

  if (loading || userRole === null) {
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
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Calendar className="h-10 w-10 text-primary" />
              Welcome, {user?.user_metadata?.full_name || 'Admin'}!
            </h1>
            <p className="text-muted-foreground mt-2">Here's your booking management overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Activity className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">8</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved Bookings</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">42</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">5</div>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Bookings and Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <p className="text-sm text-muted-foreground">Click on any entry to see available resources</p>
              </CardHeader>
              <CardContent>
                <ScheduleView date={today} title="" showFilters={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <p className="text-sm text-muted-foreground">Click on any entry to see available resources</p>
              </CardHeader>
              <CardContent>
                <TimetableView title="" showTodayOnly={true} />
              </CardContent>
            </Card>
          </div>

          {/* Available Resources Viewer */}
          <AvailableResourcesViewer />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <a href="/admin/bookings#my-upcoming">View Bookings</a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/admin/bookings#upcoming">Manage Resources</a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/admin/requests">Book Resource for Admin</a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/book-resource">Book Resource for User</a>
                </Button>
              </CardContent>
            </Card>

            {/* Visual Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Booking Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;