import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db, UserSettings } from "@/lib/db";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bio, setBio] = useState("");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await db.user_settings.toArray();
      if (settings.length > 0) {
        const userSettings = settings[0];
        setBio(userSettings.bio || "");
        setLlmApiKey(userSettings.llm_api_key || "");
        setTelegramBotToken(userSettings.telegram_bot_token || "");
        if (userSettings.theme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleThemeChange = async (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    await saveSettings(checked ? "dark" : "light", bio, llmApiKey, telegramBotToken);
  };

  const handleSave = async () => {
    await saveSettings(isDarkMode ? "dark" : "light", bio, llmApiKey, telegramBotToken);
  };

  const saveSettings = async (theme: string, userBio: string, apiKey: string, botToken: string) => {
    try {
      const existingSettings = await db.user_settings.toArray();
      
      const settingsData: UserSettings = {
        theme,
        bio: userBio || undefined,
        llm_api_key: apiKey || undefined,
        telegram_bot_token: botToken || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingSettings.length > 0) {
        await db.user_settings.update(existingSettings[0].id!, settingsData);
      } else {
        await db.user_settings.add(settingsData);
      }

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and API keys</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how EngageSphere looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure your LLM and Telegram bot tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="llm-api">LLM API Key</Label>
            <Input
              id="llm-api"
              type="password"
              placeholder="Enter your LLM API key"
              value={llmApiKey}
              onChange={(e) => setLlmApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used for AI-powered message generation and analysis
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram-bot">Telegram Bot Token</Label>
            <Input
              id="telegram-bot"
              type="password"
              placeholder="Enter your Telegram bot token"
              value={telegramBotToken}
              onChange={(e) => setTelegramBotToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used to send messages to attendees via Telegram
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your organizer information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Organizer Details / Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your organization..."
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
