import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";

const AdminBookingRequests = () => {
  const { isAuthenticated, loading, user, userRole } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [freeSlots, setFreeSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resource types
        const types = await backend.getResourceTypes();
        setResourceTypes(types);
        
        // Fetch all resources
        const allResources = await backend.getResources();
        setResources(allResources);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load resources");
      }
    };
    
    if (isAuthenticated && userRole === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedResource || !date) return;
      
      setLoadingSlots(true);
      try {
        const slots = await backend.getTimeSlots(
          parseInt(selectedResource),
          date.toISOString().split('T')[0]
        );
        setFreeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast.error("Failed to load time slots");
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchTimeSlots();
  }, [selectedResource, date]);

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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !selectedResource || !user) {
      toast.error("Please select a resource and time slot");
      return;
    }
    
    try {
      const bookingData = {
        resource_id: parseInt(selectedResource),
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        purpose: (document.getElementById("purpose") as HTMLTextAreaElement)?.value || ""
      };
      
      await backend.addBooking(bookingData);
      toast.success("Resource booked successfully!");
      setSelectedSlot(null);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book resource");
    }
  };

  const filteredResources = selectedType 
    ? resources.filter(resource => resource.type_id === parseInt(selectedType))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Book a Resource</h1>
          <p className="text-muted-foreground">Select a resource type and time slot</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar and Resource Selection */}
          <Card className="p-6 lg:col-span-2 space-y-6 animate-slide-up">
            {/* Resource Type Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Select Resource Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {resourceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id.toString())}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      selectedType === type.id.toString()
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Resource Selection */}
            {selectedType && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Select Specific Resource</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredResources.map((resource) => (
                    <button
                      key={resource.id}
                      onClick={() => setSelectedResource(resource.id.toString())}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedResource === resource.id.toString()
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {resource.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Capacity: {resource.capacity}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {selectedResource && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Select Date</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-3"
                />
              </div>
            )}
          </Card>

          {/* Booking Form and Time Slots */}
          <div className="space-y-6">
            <Card className="p-6 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4">Time Slots</h2>
              
              {selectedResource && date ? (
                <div className="space-y-3">
                  {loadingSlots ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : freeSlots.length > 0 ? (
                    freeSlots.map((slot: any, index: number) => {
                      const startTime = new Date(slot.start_time);
                      const endTime = new Date(slot.end_time);
                      const timeString = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !slot.is_booked && !slot.is_timetable && setSelectedSlot(slot)}
                          disabled={slot.is_booked || slot.is_timetable}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            selectedSlot?.start_time === slot.start_time
                              ? "border-primary bg-primary/5"
                              : slot.is_booked
                              ? "border-destructive/50 bg-destructive/5 cursor-not-allowed opacity-70"
                              : slot.is_timetable
                              ? "border-blue-500/50 bg-blue-500/5 cursor-not-allowed opacity-70"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{timeString}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              slot.is_booked 
                                ? "bg-destructive/10 text-destructive" 
                                : slot.is_timetable
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-success/10 text-success"
                            }`}>
                              {slot.is_booked ? "Booked" : slot.is_timetable ? "Class" : "Available"}
                            </span>
                          </div>
                          {slot.is_booked && slot.booking_info && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Booked by: {slot.booking_info.user_name}
                            </div>
                          )}
                          {slot.is_timetable && slot.timetable_info && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {slot.timetable_info.subject_name} ({slot.timetable_info.subject_code})
                            </div>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No time slots available for this date
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  {selectedResource 
                    ? "Select a date to view time slots" 
                    : "Select a resource to view time slots"}
                </div>
              )}
            </Card>

            <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Resource</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    {selectedResource 
                      ? resources.find(r => r.id === parseInt(selectedResource))?.name 
                      : "No resource selected"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Time</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    {selectedSlot 
                      ? `${new Date(selectedSlot.start_time).toLocaleString()} - ${new Date(selectedSlot.end_time).toLocaleString()}`
                      : "No time slot selected"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose/Notes</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Enter the purpose of your booking (optional)"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!selectedSlot || !selectedResource}
                >
                  Confirm Booking
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminBookingRequests;