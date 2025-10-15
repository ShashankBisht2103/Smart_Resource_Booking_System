import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, XCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";
import ScheduleView from "@/components/ScheduleView";
import TimetableView from "@/components/TimetableView";

const MyBookings = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setLoadingBookings(true);
      try {
        // Fetch all bookings
        const allBookings = await backend.getBookings();
        
        // Separate upcoming and past bookings
        const now = new Date();
        const upcoming = allBookings.filter((booking: any) => 
          new Date(booking.start_time) > now && booking.user_id === user.id
        );
        
        const past = allBookings.filter((booking: any) => 
          new Date(booking.start_time) <= now && booking.user_id === user.id
        );
        
        setBookings(upcoming);
        setPastBookings(past);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };
    
    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  const handleCancel = async (id: number) => {
    try {
      await backend.cancelBooking(id, user?.id, undefined);
      toast.success("Booking cancelled successfully");
      
      // Refresh bookings
      const allBookings = await backend.getBookings();
      const now = new Date();
      const upcoming = allBookings.filter((booking: any) => 
        new Date(booking.start_time) > now && booking.user_id === user?.id && booking.status !== 'cancelled'
      );
      setBookings(upcoming);
      
      // Also update past bookings to include any that were cancelled today
      const past = allBookings.filter((booking: any) => 
        new Date(booking.start_time) <= now && booking.user_id === user?.id
      );
      setPastBookings(past);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      if (error.message && error.message.includes('Permission denied')) {
        toast.error("Permission denied: You cannot cancel this booking");
      } else {
        toast.error("Failed to cancel booking");
      }
    }
  };

  const handleReschedule = (id: number) => {
    toast.info("Redirecting to reschedule...");
    // In a real implementation, this would navigate to the booking page with the booking ID
  };

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

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => (
    <Card className="p-6 hover-lift animate-scale-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{booking.resource_name || booking.resource}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(booking.start_time).toLocaleDateString("en-US", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {booking.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{booking.location}</span>
              </div>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === "confirmed"
              ? "bg-success/10 text-success"
              : booking.status === "pending"
              ? "bg-warning/10 text-warning"
              : booking.status === "completed"
              ? "bg-primary/10 text-primary"
              : booking.status === "cancelled"
              ? "bg-destructive/10 text-destructive"
              : "bg-success/10 text-success"
          }`}
        >
          {booking.status || "confirmed"}
        </span>
      </div>

      {/* Show cancel button for both past and upcoming bookings if not already cancelled */}
      {booking.status !== "cancelled" && (
        <div className="flex gap-2 mt-4">
          {!isPast && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleReschedule(booking.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => handleCancel(booking.id)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your reservations</p>
        </div>

        {loadingBookings ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="today" className="px-8">
                Today's Schedule
              </TabsTrigger>
              <TabsTrigger value="timetable" className="px-8">
                Today's Classes
              </TabsTrigger>
              <TabsTrigger value="schedule" className="px-8">
                Full Schedule
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="px-8">
                Upcoming Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="px-8">
                Past Bookings ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <ScheduleView userId={user?.id} date={today} title="Today's Bookings" showFilters={false} />
            </TabsContent>

            <TabsContent value="timetable">
              <TimetableView title="Today's Classes" showTodayOnly={true} />
            </TabsContent>

            <TabsContent value="schedule">
              <ScheduleView userId={user?.id} title="My Schedule" />
            </TabsContent>

            <TabsContent value="upcoming">
              {bookings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking, index) => (
                    <div key={booking.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <BookingCard booking={booking} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
                  <p>When you book a resource, it will appear here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastBookings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastBookings.map((booking, index) => (
                    <div key={booking.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <BookingCard booking={booking} isPast />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
                  <p>Your booking history will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;