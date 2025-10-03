import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users } from "lucide-react";
import { db, Event, AttendeeNumber } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";

const Campaigns = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Form state
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await db.events.orderBy('event_date').reverse().toArray();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !startTime || !endTime) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let attendeesCount = 0;

      // Create event
      const eventId = await db.events.add({
        event_name: eventName,
        description: description || undefined,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        attendees_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Parse and store CSV if uploaded
      if (csvFile) {
        Papa.parse(csvFile, {
          header: true,
          complete: async (results) => {
            const attendees: any[] = results.data.filter((row: any) => row.name && row.phone_number);
            attendeesCount = attendees.length;

            for (const attendee of attendees) {
              await db.attendee_numbers.add({
                event_id: Number(eventId),
                name: attendee.name,
                phone_number: attendee.phone_number,
                created_at: new Date().toISOString(),
              });
            }

            // Update event with attendee count
            await db.events.update(Number(eventId), { attendees_count: attendeesCount });
            
            toast({
              title: "Event created",
              description: `${attendeesCount} attendees imported from CSV`,
            });
            
            loadEvents();
          },
          error: () => {
            toast({
              title: "CSV parse error",
              description: "Failed to parse CSV file",
              variant: "destructive",
            });
          }
        });
      } else {
        toast({
          title: "Event created",
          description: "Your campaign has been created successfully",
        });
        loadEvents();
      }

      // Reset form
      setEventName("");
      setDescription("");
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setCsvFile(null);
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and review your event campaigns</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a new event engagement campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Event Name *</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-desc">Description</Label>
                <Textarea 
                  id="campaign-desc" 
                  placeholder="Enter event description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-date">Event Date *</Label>
                  <Input 
                    id="campaign-date" 
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input 
                    id="start-time" 
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input 
                    id="end-time" 
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees-csv">Upload Attendees CSV (name, phone_number)</Label>
                <Input 
                  id="attendees-csv" 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  CSV should have columns: name, phone_number
                </p>
              </div>
              <Button className="w-full" onClick={handleCreateEvent}>Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No campaigns yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEvent(event)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    {event.description && (
                      <CardDescription className="mt-1">{event.description}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.attendees_count} attendees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.event_name}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.start_time} - {selectedEvent.end_time}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedEvent.attendees_count}</p>
                  </CardContent>
                </Card>
              </div>

              {(selectedEvent.positives || selectedEvent.improvements) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Event Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedEvent.positives && (
                      <div>
                        <h4 className="font-semibold mb-2">Positives:</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {selectedEvent.positives}
                        </p>
                      </div>
                    )}
                    {selectedEvent.improvements && (
                      <div>
                        <h4 className="font-semibold mb-2">Improvements:</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {selectedEvent.improvements}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
