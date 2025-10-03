import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { db, Event } from "@/lib/db";

const Analytics = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [positivesData, setPositivesData] = useState<any[]>([]);
  const [improvementsData, setImprovementsData] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadEventAnalytics(Number(selectedEventId));
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      const allEvents = await db.events.orderBy('event_date').reverse().toArray();
      setEvents(allEvents);
      if (allEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(String(allEvents[0].id));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadEventAnalytics = async (eventId: number) => {
    try {
      const event = await db.events.get(eventId);
      setSelectedEvent(event || null);

      // Mock analytics data based on user replies
      // In real implementation, this would analyze actual user_replies table
      setPositivesData([
        { name: "Host Quality", value: 8.5 },
        { name: "Explanation", value: 9.2 },
        { name: "Content Coverage", value: 8.8 },
        { name: "Engagement", value: 8.1 },
        { name: "Materials", value: 7.6 },
      ]);

      setImprovementsData([
        { name: "Audio Quality", priority: 8 },
        { name: "Q&A Time", priority: 7 },
        { name: "Session Length", priority: 6 },
        { name: "Breakout Rooms", priority: 5 },
        { name: "Follow-up", priority: 4 },
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Detailed Event Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into event feedback and insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>Choose an event to view detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="event-select">Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger id="event-select">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={String(event.id)}>
                    {event.event_name} - {new Date(event.event_date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Positives (Scored 0-10)</CardTitle>
                <CardDescription>AI-analyzed positive aspects from attendee feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={positivesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--foreground))" domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvements (Priority 0-10)</CardTitle>
                <CardDescription>AI-identified areas needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={improvementsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--foreground))" domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="priority" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Positives - Detailed Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  {selectedEvent.positives ? (
                    <p className="text-sm leading-relaxed">{selectedEvent.positives}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Positive feedback summary will appear here after AI analysis of attendee replies
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvements - Detailed Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  {selectedEvent.improvements ? (
                    <p className="text-sm leading-relaxed">{selectedEvent.improvements}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Improvement suggestions will appear here after AI analysis of attendee replies
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
