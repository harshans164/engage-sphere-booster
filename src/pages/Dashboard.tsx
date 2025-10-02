import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Users, MessageSquare, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [preEventEnabled, setPreEventEnabled] = useState(false);
  const [duringEventEnabled, setDuringEventEnabled] = useState(false);
  const [postEventEnabled, setPostEventEnabled] = useState(false);

  const mockAnalysisData = [
    { name: "Engagement", value: 85 },
    { name: "Satisfaction", value: 92 },
    { name: "Content Quality", value: 88 },
    { name: "Networking", value: 78 },
  ];

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
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Event
              </CardTitle>
              <CardDescription>Next scheduled webinar</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold mb-2">Product Launch Webinar 2025</h3>
              <p className="text-muted-foreground mb-4">Join us for an exciting product demonstration</p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Jan 15, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>250 Registered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Total Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground mt-1">Last event</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Engagement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground mt-1">Last event</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">4.8/5</p>
                <p className="text-sm text-muted-foreground mt-1">Last event</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Event Messages</CardTitle>
              <CardDescription>Send automated messages before the event starts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="pre-event">Enable Pre-Event Messages</Label>
                <Switch
                  id="pre-event"
                  checked={preEventEnabled}
                  onCheckedChange={setPreEventEnabled}
                />
              </div>
              {preEventEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pre-attendees">Upload Attendee List (CSV)</Label>
                    <Input id="pre-attendees" type="file" accept=".csv" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pre-message">Message Content</Label>
                    <Textarea
                      id="pre-message"
                      placeholder="Enter your pre-event message..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">Schedule Pre-Event Messages</Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>During-Event Messages</CardTitle>
              <CardDescription>Send timed messages during the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="during-event">Enable During-Event Messages</Label>
                <Switch
                  id="during-event"
                  checked={duringEventEnabled}
                  onCheckedChange={setDuringEventEnabled}
                />
              </div>
              {duringEventEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="during-time">Send At (Event Time)</Label>
                    <Input id="during-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="during-message">Message Content</Label>
                    <Textarea
                      id="during-message"
                      placeholder="Enter your during-event message..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">Schedule During-Event Messages</Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Post-Event Messages</CardTitle>
              <CardDescription>Send follow-up messages after the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="post-event">Enable Post-Event Messages</Label>
                <Switch
                  id="post-event"
                  checked={postEventEnabled}
                  onCheckedChange={setPostEventEnabled}
                />
              </div>
              {postEventEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="post-message">Message Content</Label>
                    <Textarea
                      id="post-message"
                      placeholder="Enter your post-event message..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">Schedule Post-Event Messages</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance Metrics</CardTitle>
              <CardDescription>Analysis from your last completed event</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
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
              <CardTitle>AI-Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">
                  The last event showed strong engagement across all metrics. Attendees particularly
                  appreciated the interactive Q&A sessions and networking opportunities. Key areas
                  for improvement include technical audio quality and providing more time for
                  breakout discussions. Overall satisfaction remained high at 92%, with 78% of
                  attendees expressing interest in future events.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
