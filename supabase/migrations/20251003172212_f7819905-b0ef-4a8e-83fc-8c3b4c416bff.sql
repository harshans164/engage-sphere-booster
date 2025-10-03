-- Create events table (data.db equivalent)
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  attendees_count INTEGER DEFAULT 0,
  positives TEXT,
  improvements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create attendee_numbers table (numbers.db equivalent)
CREATE TABLE public.attendee_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_replies table to store feedback from attendees
CREATE TABLE public.user_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES public.attendee_numbers(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  reply_type TEXT CHECK (reply_type IN ('pre_event', 'during_event', 'post_event')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create message_schedule table to track scheduled messages
CREATE TABLE public.message_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('pre_event', 'during_event', 'post_event')),
  message_content TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  custom_time_minutes INTEGER,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create settings table for API keys
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  llm_api_key TEXT,
  telegram_bot_token TEXT,
  theme TEXT DEFAULT 'light',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is an event management app)
CREATE POLICY "Allow all operations on events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on attendee_numbers" ON public.attendee_numbers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_replies" ON public.user_replies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on message_schedules" ON public.message_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_settings" ON public.user_settings FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();