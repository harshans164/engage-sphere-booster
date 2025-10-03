import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { db, Event } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [latestEvent, setLatestEvent] = useState<Event | null>(null);
  const [positivesData, setPositivesData] = useState<any[]>([]);
  const [improvementsData, setImprovementsData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadLatestEvent();
  }, []);

  const loadLatestEvent = async () => {
    try {
      const events = await db.events
        .orderBy('event_date')
        .reverse()
        .limit(1)
        .toArray();
      
      if (events.length > 0) {
        setLatestEvent(events[0]);
        // Mock analytics data - in real implementation, this would analyze user_replies
        setPositivesData([
          { name: "Host Quality", value: 8.5 },
          { name: "Explanation", value: 9.2 },
          { name: "Content Coverage", value: 8.8 },
          { name: "Engagement", value: 7.9 },
        ]);
        setImprovementsData([
          { name: "Audio Quality", priority: 8 },
          { name: "Q&A Time", priority: 7 },
          { name: "Session Length", priority: 6 },
        ]);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your event engagement campaigns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-actions">AI Bot Actions</TabsTrigger>
          <TabsTrigger value="analysis">Latest Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {latestEvent ? (
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Latest Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{latestEvent.event_name}</h3>
                  {latestEvent.description && (
                    <p className="text-muted-foreground mb-4">{latestEvent.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(latestEvent.event_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-semibold">{latestEvent.start_time} - {latestEvent.end_time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Attendees</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {latestEvent.attendees_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-semibold">{new Date(latestEvent.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No events yet. Create one in the Campaigns page!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Event Messages</CardTitle>
              <CardDescription>Sends 15 minutes before event starts (customizable)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pre-minutes">Minutes Before Event</Label>
                <Input id="pre-minutes" type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pre-message">Message Template</Label>
                <Textarea
                  id="pre-message"
                  placeholder="AI will generate personalized pre-event messages..."
                  rows={4}
                />
              </div>
              <Button className="w-full">Configure Pre-Event Bot</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>During-Event Messages</CardTitle>
              <CardDescription>Send timed messages during the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="during-time">Send At (Event Time)</Label>
                <Input id="during-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="during-message">Message Template</Label>
                <Textarea
                  id="during-message"
                  placeholder="AI will generate engagement messages..."
                  rows={4}
                />
              </div>
              <Button className="w-full">Configure During-Event Bot</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Post-Event Messages</CardTitle>
              <CardDescription>Sends 5 minutes after event ends (customizable)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-minutes">Minutes After Event</Label>
                <Input id="post-minutes" type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-message">Message Template</Label>
                <Textarea
                  id="post-message"
                  placeholder="AI will generate follow-up messages..."
                  rows={4}
                />
              </div>
              <Button className="w-full">Configure Post-Event Bot</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Positives</CardTitle>
                <CardDescription>Rated aspects from attendee feedback</CardDescription>
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
                <CardTitle>Improvements</CardTitle>
                <CardDescription>Priority areas from AI analysis</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                {latestEvent?.positives || latestEvent?.improvements ? (
                  <div className="space-y-4">
                    {latestEvent.positives && (
                      <div>
                        <h4 className="font-semibold mb-2">Positives:</h4>
                        <p className="text-sm leading-relaxed">{latestEvent.positives}</p>
                      </div>
                    )}
                    {latestEvent.improvements && (
                      <div>
                        <h4 className="font-semibold mb-2">Improvements:</h4>
                        <p className="text-sm leading-relaxed">{latestEvent.improvements}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    AI summary will appear here after collecting attendee feedback
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
