import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TimetableEntry {
  id: number;
  section: string;
=======

interface TimetableEntry {
  id: number;
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
  day: string;
  time_start: string;
  time_end: string;
  subject_code: string;
  subject_name: string;
  faculty_name: string;
  venue: string;
  resource_id: number;
}

<<<<<<< HEAD
interface Resource {
  id: number;
  name: string;
  type_name: string;
  location: string;
  capacity: number;
  description: string;
}

=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
interface TimetableViewProps {
  title?: string;
  showTodayOnly?: boolean;
}

const TimetableView = ({ title = "Timetable", showTodayOnly = false }: TimetableViewProps) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; startTime: string; endTime: string } | null>(null);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        let timetableData: TimetableEntry[];
        if (showTodayOnly) {
          timetableData = await backend.getTodayTimetable();
        } else {
          timetableData = await backend.getTimetable();
        }
        setTimetable(timetableData);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast.error("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimetable();
  }, [showTodayOnly]);

  const formatTime = (timeString: string) => {
    // Convert HH:MM to readable format
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

<<<<<<< HEAD
  const handleTimeSlotClick = async (day: string, startTime: string, endTime: string) => {
    // Convert day to date
    const today = new Date();
    const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(day);
    const date = new Date(today);
    
    // Adjust date to the correct day of the week
    const todayIndex = today.getDay();
    const diff = dayIndex - todayIndex;
    date.setDate(today.getDate() + diff);
    
    const dateString = date.toISOString().split('T')[0];
    
    setSelectedSlot({
      date: dateString,
      startTime: startTime,
      endTime: endTime
    });
    
    // Fetch available resources for this time slot
    setResourcesLoading(true);
    try {
      const resources = await backend.getAvailableResources(
        dateString,
        startTime,
        endTime
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

=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
  // Group timetable entries by day
  const groupedTimetable: Record<string, TimetableEntry[]> = {};
  timetable.forEach(entry => {
    const day = entry.day;
    if (!groupedTimetable[day]) {
      groupedTimetable[day] = [];
    }
    groupedTimetable[day].push(entry);
  });

  // Days in order
  const daysOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const sortedDays = Object.keys(groupedTimetable).sort((a, b) => 
    daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
<<<<<<< HEAD
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sortedDays.length > 0 ? (
            <div className="space-y-6">
              {sortedDays.map(day => (
                <div key={day}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {day === 'MON' && 'Monday'}
                    {day === 'TUE' && 'Tuesday'}
                    {day === 'WED' && 'Wednesday'}
                    {day === 'THU' && 'Thursday'}
                    {day === 'FRI' && 'Friday'}
                    {day === 'SAT' && 'Saturday'}
                    {day === 'SUN' && 'Sunday'}
                  </h3>
                  <div className="space-y-3">
                    {groupedTimetable[day].map(entry => (
                      <div 
                        key={entry.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleTimeSlotClick(day, entry.time_start, entry.time_end)}
                      >
                        <div className="flex-1 mb-2 sm:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{entry.subject_code}</span>
                            <Badge variant="default">{entry.subject_name}</Badge>
                            {entry.section && (
                              <Badge variant="secondary">Section {entry.section}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(entry.time_start)} - {formatTime(entry.time_end)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <User className="h-4 w-4" />
                            <span>{entry.faculty_name || "No faculty assigned"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{entry.venue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No timetable entries found
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
                  {" "}{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
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
=======
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedDays.length > 0 ? (
          <div className="space-y-6">
            {sortedDays.map(day => (
              <div key={day}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {day === 'MON' && 'Monday'}
                  {day === 'TUE' && 'Tuesday'}
                  {day === 'WED' && 'Wednesday'}
                  {day === 'THU' && 'Thursday'}
                  {day === 'FRI' && 'Friday'}
                  {day === 'SAT' && 'Saturday'}
                  {day === 'SUN' && 'Sunday'}
                </h3>
                <div className="space-y-3">
                  {groupedTimetable[day].map(entry => (
                    <div 
                      key={entry.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{entry.subject_code}</span>
                          <Badge variant="default">{entry.subject_name}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(entry.time_start)} - {formatTime(entry.time_end)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <User className="h-4 w-4" />
                          <span>{entry.faculty_name || "No faculty assigned"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{entry.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No timetable entries found
          </div>
        )}
      </CardContent>
    </Card>
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
  );
};

export default TimetableView;