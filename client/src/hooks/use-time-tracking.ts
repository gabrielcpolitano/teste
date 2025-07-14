import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { 
  User, 
  WorkSession, 
  DayRecord, 
  WeeklyHistoryItem,
  AppState 
} from '../types';
import { 
  getDateString, 
  isToday, 
  calculateSessionDuration, 
  wasAbsent, 
  getWeekDates,
  formatDateShort 
} from '../lib/time-utils';

export function useTimeTracking() {
  const [user, setUser] = useLocalStorage<User | null>('ponto-dev-user', null);
  const [dayRecords, setDayRecords] = useLocalStorage<Record<string, DayRecord>>('ponto-dev-records', {});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [pendingAbsenceDate, setPendingAbsenceDate] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for absences on app load
  useEffect(() => {
    if (user) {
      checkForAbsences();
    }
  }, [user]);

  const checkForAbsences = () => {
    const today = getDateString(new Date());
    const yesterday = getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    // Check if yesterday was a working day and no record exists
    if (wasAbsent(yesterday) && !dayRecords[yesterday]) {
      setPendingAbsenceDate(yesterday);
      setShowAbsenceModal(true);
    }
  };

  const login = (name: string) => {
    const newUser: User = {
      name,
      loginDate: new Date().toISOString()
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const getTodayRecord = (): DayRecord => {
    const today = getDateString(new Date());
    return dayRecords[today] || {
      date: today,
      sessions: [],
      totalMinutes: 0,
      goalMet: false,
      expedienteClosed: false
    };
  };

  const getCurrentSession = (): WorkSession | null => {
    const todayRecord = getTodayRecord();
    return todayRecord.sessions.find(session => session.status === 'active') || null;
  };

  const clockIn = () => {
    const today = getDateString(new Date());
    const todayRecord = getTodayRecord();
    
    const newSession: WorkSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      duration: 0,
      status: 'active'
    };

    const updatedRecord = {
      ...todayRecord,
      sessions: [...todayRecord.sessions, newSession]
    };

    setDayRecords(prev => ({
      ...prev,
      [today]: updatedRecord
    }));

    return newSession;
  };

  const clockOut = () => {
    const today = getDateString(new Date());
    const todayRecord = getTodayRecord();
    const activeSession = getCurrentSession();

    if (!activeSession) return null;

    const endTime = new Date().toISOString();
    const duration = calculateSessionDuration(activeSession.startTime, endTime);

    const updatedSessions = todayRecord.sessions.map(session =>
      session.id === activeSession.id
        ? { ...session, endTime, duration, status: 'completed' as const }
        : session
    );

    const totalMinutes = updatedSessions.reduce((sum, session) => sum + session.duration, 0);

    const updatedRecord = {
      ...todayRecord,
      sessions: updatedSessions,
      totalMinutes,
      goalMet: totalMinutes >= 180 // 3 hours
    };

    setDayRecords(prev => ({
      ...prev,
      [today]: updatedRecord
    }));

    return { ...activeSession, endTime, duration, status: 'completed' as const };
  };

  const endWorkday = () => {
    const today = getDateString(new Date());
    const todayRecord = getTodayRecord();
    
    // End any active session first
    const activeSession = getCurrentSession();
    if (activeSession) {
      clockOut();
    }

    // Get updated record after clocking out
    const updatedTodayRecord = getTodayRecord();
    
    const finalRecord = {
      ...updatedTodayRecord,
      expedienteClosed: true
    };

    setDayRecords(prev => ({
      ...prev,
      [today]: finalRecord
    }));

    return finalRecord;
  };

  const submitAbsenceJustification = (justification: string) => {
    if (!pendingAbsenceDate) return;

    const absenceRecord: DayRecord = {
      date: pendingAbsenceDate,
      sessions: [],
      totalMinutes: 0,
      goalMet: false,
      expedienteClosed: true,
      justification
    };

    setDayRecords(prev => ({
      ...prev,
      [pendingAbsenceDate]: absenceRecord
    }));

    setShowAbsenceModal(false);
    setPendingAbsenceDate(null);
  };

  const getWeeklyHistory = (): WeeklyHistoryItem[] => {
    const weekDates = getWeekDates();
    
    return weekDates.map(date => {
      const record = dayRecords[date];
      const dateObj = new Date(date);
      
      let status: WeeklyHistoryItem['status'] = 'absence';
      
      if (record) {
        if (isToday(date) && !record.expedienteClosed) {
          status = 'in-progress';
        } else if (record.goalMet) {
          status = 'goal';
        } else if (record.totalMinutes > 0) {
          status = 'partial';
        }
      }

      return {
        date,
        displayDate: formatDateShort(dateObj),
        totalMinutes: record?.totalMinutes || 0,
        status,
        justification: record?.justification
      };
    });
  };

  const getStreakCount = (): number => {
    const weeklyHistory = getWeeklyHistory();
    let streak = 0;
    
    // Count consecutive days with goal met (from most recent backwards)
    for (let i = weeklyHistory.length - 1; i >= 0; i--) {
      const day = weeklyHistory[i];
      if (day.status === 'goal' || day.status === 'in-progress') {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    user,
    currentTime,
    showAbsenceModal,
    pendingAbsenceDate,
    login,
    logout,
    getTodayRecord,
    getCurrentSession,
    clockIn,
    clockOut,
    endWorkday,
    submitAbsenceJustification,
    getWeeklyHistory,
    getStreakCount,
    setShowAbsenceModal
  };
}
