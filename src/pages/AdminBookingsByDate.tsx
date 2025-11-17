import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";
<<<<<<< HEAD
import AvailableResourcesViewer from "@/components/AvailableResourcesViewer";
=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a

const AdminBookingsByDate = () => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || userRole !== 'admin') return;
      
      setLoadingBookings(true);
      try {
        let allBookings;
        if (date) {
          // Fetch bookings for specific date
          allBookings = await backend.getBookingsByDate(date.toISOString().split('T')[0]);
        } else {
          // Fetch all bookings
          allBookings = await backend.getBookings();
        }
        setBookings(allBookings);
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
  }, [isAuthenticated, userRole, date]);

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

  // Filter bookings by search term (date filtering is done on backend)
  const filteredBookings = bookings.filter(booking => {
    return searchTerm 
      ? booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.resource_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "outline",
      confirmed: "default",
      cancelled: "destructive",
      completed: "secondary"
    };
    return <Badge variant={variants[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold">Bookings by Date</h1>
            <p className="text-muted-foreground mt-2">View and manage bookings for any date</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filter Bookings</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user or resource..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                  {datePickerOpen && (
                    <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDate(undefined);
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {date 
                  ? `Bookings for ${format(date, "PPP")}` 
                  : "All Bookings"}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredBookings.length} results)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user_name}</TableCell>
                        <TableCell>{booking.resource_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(booking.start_time).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.purpose || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(booking.status || "confirmed")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {date || searchTerm 
                    ? "No bookings found matching your filters" 
                    : "No bookings found"}
                </div>
              )}
            </CardContent>
          </Card>
<<<<<<< HEAD

          {/* Available Resources Viewer */}
          <AvailableResourcesViewer />
=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBookingsByDate;