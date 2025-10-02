import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockInterestsData = [
  { name: "Product Features", value: 45 },
  { name: "Pricing", value: 32 },
  { name: "Integration", value: 28 },
  { name: "Support", value: 25 },
  { name: "Roadmap", value: 20 },
];

const mockImprovementsData = [
  { name: "Audio Quality", value: 18 },
  { name: "Session Length", value: 15 },
  { name: "Q&A Time", value: 12 },
  { name: "Breakout Rooms", value: 10 },
  { name: "Materials", value: 8 },
];

const Analytics = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
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
          <CardTitle>Upload Feedback Data</CardTitle>
          <CardDescription>Upload a CSV file containing attendee feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-csv">Feedback CSV File</Label>
              <div className="flex gap-2">
                <Input
                  id="feedback-csv"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button className="gap-2" disabled={!uploadedFile}>
                  <Upload className="h-4 w-4" />
                  Upload & Analyze
                </Button>
              </div>
            </div>
            {uploadedFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {uploadedFile.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Common Interests</CardTitle>
            <CardDescription>Topics that generated the most interest</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockInterestsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
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
            <CardTitle>Improvement Areas</CardTitle>
            <CardDescription>Feedback on areas needing improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockImprovementsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary & Tips</CardTitle>
          <CardDescription>Insights and recommendations based on feedback analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-muted rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Key Findings:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Product features and pricing were the top areas of interest among attendees</li>
                <li>Audio quality issues were the most frequently mentioned improvement area</li>
                <li>Attendees requested more interactive Q&A time and breakout sessions</li>
                <li>Overall engagement remained high throughout the event duration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Invest in professional audio equipment for future events</li>
                <li>Extend Q&A sessions by 15-20 minutes to accommodate more questions</li>
                <li>Consider implementing dedicated breakout rooms for specialized topics</li>
                <li>Prepare additional materials on product features and pricing for follow-up</li>
                <li>Send post-event surveys within 24 hours to capture fresh feedback</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
