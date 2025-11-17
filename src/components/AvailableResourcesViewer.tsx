import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import * as backend from "@/integrations/backend/client";
import { format } from "date-fns";

interface Resource {
  id: number;
  name: string;
  type_name: string;
  location: string;
  capacity: number;
  description: string;
}

const AvailableResourcesViewer = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("08:55");
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleViewAvailableResources = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    setShowResults(true);
    try {
      const dateString = date.toISOString().split('T')[0];
      const resources = await backend.getAvailableResources(dateString, time, endTime);
      setAvailableResources(resources);
    } catch (error) {
      console.error("Error fetching available resources:", error);
      toast.error("Failed to load available resources");
      setAvailableResources([]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { start: "08:00", end: "08:55", label: "08:00 - 08:55" },
    { start: "08:55", end: "09:50", label: "08:55 - 09:50" },
    { start: "09:50", end: "10:10", label: "09:50 - 10:10 (Break)" },
    { start: "10:10", end: "11:05", label: "10:10 - 11:05" },
    { start: "11:05", end: "12:00", label: "11:05 - 12:00" },
    { start: "12:00", end: "12:55", label: "12:00 - 12:55" },
    { start: "12:55", end: "13:50", label: "12:55 - 13:50" },
    { start: "13:50", end: "14:10", label: "13:50 - 14:10 (Break)" },
    { start: "14:10", end: "15:05", label: "14:10 - 15:05" },
    { start: "15:05", end: "16:00", label: "15:05 - 16:00" },
    { start: "16:00", end: "16:55", label: "16:00 - 16:55" },
    { start: "16:55", end: "17:50", label: "16:55 - 17:50" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Available Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a date and time slot to view available resources
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Select Time Slot</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => {
                    setTime(slot.start);
                    setEndTime(slot.end);
                  }}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    time === slot.start && endTime === slot.end
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleViewAvailableResources} 
            disabled={loading || !date}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              "Show Available Resources"
            )}
          </Button>
        </div>
        
        {showResults && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">
              Available Resources for {date ? format(date, "PPP") : ""} | {time} - {endTime}
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : availableResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableResources.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {resource.type_name}
                        </Badge>
                      </div>
                      <Button size="sm" onClick={() => {
                        toast.info(`You can book ${resource.name} by going to the Book Resource page`);
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
              <div className="text-center py-8 text-muted-foreground">
                No available resources for the selected time slot
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableResourcesViewer;