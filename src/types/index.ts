export type ScreenType = 'overview' | 'study_time' | 'courses' | 'social' | 'analytics';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type Priority = 'low' | 'medium' | 'high';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  dueTime?: string;
  estimatedHours: number;
  completedHours?: number;
  notes?: string;
}

export interface DayStudyData {
  day: string; // 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'
  fullDate: string;
  hours: number;
  breakdown: {
    coding: number;
    algorithms: number;
    softwareTool: number;
    dataStructures: number;
  };
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 1 = Mon, 7 = Sun
  subject: string;
  code: string;
  room: string;
  startTime: string; // '09:00'
  endTime: string;   // '10:30'
  color: string;
  type: 'Lecture' | 'Lab' | 'Study Session';
}

export interface StudyPartner {
  id: string;
  name: string;
  avatar: string;
  status: 'Studying' | 'Break' | 'Offline';
  currentSubject: string;
  hoursToday: number;
  rank: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  activeMembers: number;
  maxMembers: number;
  targetFocusMinutes: number;
  isPrivate: boolean;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

export interface FlutterCodeFile {
  filename: string;
  path: string;
  category: 'core' | 'screens' | 'widgets' | 'models' | 'providers' | 'config';
  description: string;
  code: string;
}
