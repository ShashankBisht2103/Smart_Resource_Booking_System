import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import * as backend from "@/integrations/backend/client";
import { toast } from "sonner";

interface TimetableEntry {
  id: number;
  day: string;
  time_start: string;
  time_end: string;
  subject_code: string;
  subject_name: string;
  faculty_name: string;
  venue: string;
  resource_id: number;
}

interface TimetableViewProps {
  title?: string;
  showTodayOnly?: boolean;
}

const TimetableView = ({ title = "Timetable", showTodayOnly = false }: TimetableViewProps) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
  );
};

export default TimetableView;