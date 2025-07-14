export interface User {
  name: string;
  loginDate: string;
}

export interface WorkSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  status: 'active' | 'completed';
}

export interface DayRecord {
  date: string;
  sessions: WorkSession[];
  totalMinutes: number;
  goalMet: boolean;
  expedienteClosed: boolean;
  justification?: string;
}

export interface WeeklyHistoryItem {
  date: string;
  displayDate: string;
  totalMinutes: number;
  status: 'goal' | 'partial' | 'absence' | 'in-progress';
  justification?: string;
}

export interface AppState {
  user: User | null;
  currentSession: WorkSession | null;
  todayRecord: DayRecord | null;
  weeklyHistory: WeeklyHistoryItem[];
  showAbsenceModal: boolean;
  pendingAbsenceDate: string | null;
}

export type NotificationType = 'success' | 'warning' | 'error' | 'info';
