import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, TrendingUp } from "lucide-react";

const mockCampaigns = [
  {
    id: 1,
    name: "Product Launch Webinar",
    description: "Launch event for our new product line",
    date: "2024-12-15",
    status: "completed",
    attendees: 1247,
    engagement: 87,
  },
  {
    id: 2,
    name: "Q4 Strategy Summit",
    description: "Quarterly strategy and planning session",
    date: "2024-11-20",
    status: "completed",
    attendees: 892,
    engagement: 91,
  },
  {
    id: 3,
    name: "Tech Innovation Forum",
    description: "Discussion on emerging technologies",
    date: "2024-10-10",
    status: "completed",
    attendees: 1523,
    engagement: 84,
  },
];

const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<typeof mockCampaigns[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and review your event campaigns</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a new event engagement campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input id="campaign-name" placeholder="Enter campaign name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-desc">Description</Label>
                <Textarea id="campaign-desc" placeholder="Enter campaign description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-date">Event Date</Label>
                <Input id="campaign-date" type="date" />
              </div>
              <Button className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="mt-1">{campaign.description}</CardDescription>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(campaign.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.attendees} attendees</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.engagement}% engagement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name}</DialogTitle>
            <DialogDescription>{selectedCampaign?.description}</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedCampaign.attendees}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedCampaign.engagement}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4.5/5</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Event Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    This event demonstrated strong performance across key metrics. Attendees showed
                    high engagement throughout the session, with particular interest in the Q&A
                    segments. Feedback highlighted excellent content quality and speaker expertise.
                    Areas for improvement include technical setup and allowing more time for
                    networking.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
