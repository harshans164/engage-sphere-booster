import Dexie, { Table } from 'dexie';

export interface Event {
  id?: number;
  event_name: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  attendees_count: number;
  positives?: string;
  improvements?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendeeNumber {
  id?: number;
  event_id: number;
  name: string;
  phone_number: string;
  created_at: string;
}

export interface UserReply {
  id?: number;
  event_id: number;
  attendee_id: number;
  reply_text: string;
  reply_type: 'pre_event' | 'during_event' | 'post_event';
  created_at: string;
}

export interface MessageSchedule {
  id?: number;
  event_id: number;
  message_type: 'pre_event' | 'during_event' | 'post_event';
  message_content: string;
  scheduled_time?: string;
  custom_time_minutes?: number;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

export interface UserSettings {
  id?: number;
  llm_api_key?: string;
  telegram_bot_token?: string;
  theme: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export class LocalDatabase extends Dexie {
  events!: Table<Event, number>;
  attendee_numbers!: Table<AttendeeNumber, number>;
  user_replies!: Table<UserReply, number>;
  message_schedules!: Table<MessageSchedule, number>;
  user_settings!: Table<UserSettings, number>;

  constructor() {
    super('EngageSphereDB');
    this.version(1).stores({
      events: '++id, event_date, created_at',
      attendee_numbers: '++id, event_id, phone_number',
      user_replies: '++id, event_id, attendee_id, reply_type',
      message_schedules: '++id, event_id, message_type, status, scheduled_time',
      user_settings: '++id'
    });
  }
}

export const db = new LocalDatabase();
