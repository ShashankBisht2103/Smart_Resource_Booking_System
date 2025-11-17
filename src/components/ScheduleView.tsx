import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";
import { Booking } from "@/integrations/backend/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ScheduleViewProps {
  userId?: string; // If provided, filter bookings for this user only
  title?: string;
  date?: string; // Specific date to filter bookings (YYYY-MM-DD format)
  showFilters?: boolean; // Whether to show the filter buttons
}

interface Resource {
  id: number;
  name: string;
  type_name: string;
  location: string;
  capacity: number;
  description: string;
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
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; startTime: string; endTime: string } | null>(null);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);

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

  const handleTimeSlotClick = async (dateStr: string, startTime: Date, endTime: Date) => {
    const startTimeStr = startTime.toTimeString().substring(0, 5); // HH:MM format
    const endTimeStr = endTime.toTimeString().substring(0, 5); // HH:MM format
    
    setSelectedSlot({
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr
    });
    
    // Fetch available resources for this time slot
    setResourcesLoading(true);
    try {
      const resources = await backend.getAvailableResources(
        dateStr,
        startTimeStr,
        endTimeStr
      );
      setAvailableResources(resources);
      setShowResourcesModal(true);
    } catch (error) {
      console.error("Error fetching available resources:", error);
      toast.error("Failed to load available resources");
    } finally {
      setResourcesLoading(false);
    }
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
    <>
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleTimeSlotClick(
                          date || dateKey, 
                          item.start_time, 
                          item.end_time
                        )}
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
                                {item.section && (
                                  <Badge variant="secondary">Section {item.section}</Badge>
                                )}
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

      {/* Available Resources Modal */}
      <Dialog open={showResourcesModal} onOpenChange={setShowResourcesModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Available Resources
              {selectedSlot && (
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  {new Date(selectedSlot.date).toLocaleDateString()} | 
                  {" "}{selectedSlot.startTime} - {selectedSlot.endTime}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {resourcesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : availableResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {availableResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {resource.type_name}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => {
                      // Here you could implement booking functionality
                      toast.info(`Booking functionality for ${resource.name} would go here`);
                    }}>
                      Book
                    </Button>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{resource.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-4 w-4" />
                      <span>Capacity: {resource.capacity || "Not specified"}</span>
                    </div>
                    {resource.description && (
                      <p className="mt-2">{resource.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No available resources for this time slot
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleView;