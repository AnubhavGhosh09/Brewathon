export interface User {
  uid: string; // Firebase Auth UID
  username: string;
  email: string;
  isLoggedIn: boolean;
  department?: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  icon: string;
  status: 'RECRUITING' | 'FULL';
}

export interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
}

export interface TimetableSlot {
  time: string;
  subject: string;
  room?: string;
  type: 'Lecture' | 'Lab' | 'Free' | 'Lunch';
}

export interface DaySchedule {
  day: string;
  slots: TimetableSlot[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'senior';
  text: string;
  timestamp: Date;
}

export interface MarketItem {
  id: string;
  title: string;
  price: string;
  seller: string; // Username
  sellerId: string; // UID for permission checks
  type: 'SELL' | 'BUY' | 'EXCHANGE';
  category: string;
  description: string;
  isVerified: boolean; // "Senior Verified"
  contact: string; // Phone, Discord, or Location
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TIMETABLE = 'TIMETABLE',
  CLUBS = 'CLUBS',
  ATTENDANCE = 'ATTENDANCE',
  MARKETPLACE = 'MARKETPLACE',
  AI_TOOLS = 'AI_TOOLS'
}