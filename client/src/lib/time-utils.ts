export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}min`;
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateString: string): boolean => {
  return dateString === getDateString(new Date());
};

export const calculateSessionDuration = (startTime: string, endTime?: string): number => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / 60000); // in minutes
};

export const getDayOfWeek = (date: Date): string => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const getGoalProgress = (minutes: number): number => {
  const goalMinutes = 3 * 60; // 3 hours
  return Math.min(Math.round((minutes / goalMinutes) * 100), 100);
};

export const wasAbsent = (date: string): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  // Check if the date is in the past and not today
  if (targetDate >= today) return false;
  
  // Check if it's a weekend (skip absence check for weekends)
  const dayOfWeek = targetDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  
  return true;
};

export const getWeekDates = (): string[] => {
  const today = new Date();
  const dates: string[] = [];
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getDateString(date));
  }
  
  return dates;
};
