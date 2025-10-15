import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";
import { Booking } from "@/integrations/backend/client";

interface ScheduleViewProps {
  userId?: string; // If provided, filter bookings for this user only
  title?: string;
  date?: string; // Specific date to filter bookings (YYYY-MM-DD format)
  showFilters?: boolean; // Whether to show the filter buttons
}

const ScheduleView = ({ 
  userId, 
  title = "Schedule", 
  date, 
  showFilters = true 
}: ScheduleViewProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        // Fetch all bookings from backend
        const allBookings: Booking[] = await backend.getBookings();
        
        // Filter bookings based on user if userId is provided
        let filteredBookings = userId 
          ? allBookings.filter(booking => booking.user_id === userId)
          : allBookings;
        
        // If a specific date is provided, filter by that date
        if (date) {
          filteredBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.start_time).toISOString().split('T')[0];
            return bookingDate === date;
          });
          
          // Also fetch timetable for the specific date
          const bookedSlots = await backend.getAllBookedTimeSlots(date);
          setTimetable(bookedSlots.filter((slot: any) => slot.type === 'timetable'));
        }
        
        // Sort bookings by start time
        const sortedBookings = [...filteredBookings].sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, [userId, date]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      confirmed: "default",
      pending: "outline",
      cancelled: "destructive",
      completed: "secondary"
    };
    return <Badge variant={variants[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      weekday: "short", 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredBookings = bookings.filter(booking => {
    if (!date) { // Only apply time filters if we're not filtering by specific date
      const now = new Date();
      const bookingDate = new Date(booking.start_time);
      
      if (filter === "upcoming") {
        return bookingDate > now;
      } else if (filter === "past") {
        return bookingDate < now;
      }
    }
    return true;
  });

  // Combine bookings and timetable entries
  const allScheduleItems = [
    ...filteredBookings.map(booking => ({
      ...booking,
      type: 'booking',
      start_time: new Date(booking.start_time),
      end_time: new Date(booking.end_time)
    })),
    ...timetable.map(entry => ({
      ...entry,
      type: 'timetable',
      start_time: new Date(entry.start_time),
      end_time: new Date(entry.end_time)
    }))
  ].sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  // Group by date (only relevant when not filtering by specific date)
  const groupedSchedule: Record<string, any[]> = {};
  if (date) {
    // If filtering by specific date, all items are already for that date
    groupedSchedule[date] = allScheduleItems;
  } else {
    // Group by date for general view
    allScheduleItems.forEach(item => {
      const dateKey = item.start_time.toDateString();
      if (!groupedSchedule[dateKey]) {
        groupedSchedule[dateKey] = [];
      }
      groupedSchedule[dateKey].push(item);
    });
  }

  const sortedDateKeys = Object.keys(groupedSchedule).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
          {showFilters && !date && (
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === "all" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === "upcoming" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === "past" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setFilter("past")}
              >
                Past
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedDateKeys.length > 0 ? (
          <div className="space-y-6">
            {sortedDateKeys.map(dateKey => (
              <div key={dateKey}>
                {!date && ( // Only show date header when not filtering by specific date
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(dateKey)}
                  </h3>
                )}
                <div className="space-y-3">
                  {groupedSchedule[dateKey].map(item => (
                    <div 
                      key={`${item.type}-${item.id || item.booking_id || item.subject_code}`} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        {item.type === 'booking' ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.resource_name}</span>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(item.start_time)} - {formatTime(item.end_time)}</span>
                            </div>
                            {userId ? (
                              <p className="text-sm mt-1">Booked for: {item.purpose || "No purpose specified"}</p>
                            ) : (
                              <p className="text-sm mt-1">Booked by: {item.user_name}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.subject_code}</span>
                              <Badge variant="default">{item.subject_name}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(item.start_time)} - {formatTime(item.end_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <User className="h-4 w-4" />
                              <span>{item.faculty_name || "No faculty assigned"}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{item.resource_name || item.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No schedule items found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleView;