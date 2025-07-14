import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Clock, 
  Target, 
  Flame, 
  Play, 
  Pause, 
  Square, 
  LogOut,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Hourglass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTimeTracking } from '../hooks/use-time-tracking';
import { AbsenceModal } from '../components/absence-modal';
import { NotificationToast } from '../components/notification-toast';
import { formatTime, formatDate, formatDuration, getGreeting, getGoalProgress } from '../lib/time-utils';
import { getRandomMotivationalMessage } from '../lib/motivational-messages';
import { NotificationType } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const {
    user,
    currentTime,
    showAbsenceModal,
    pendingAbsenceDate,
    getTodayRecord,
    getCurrentSession,
    clockIn,
    clockOut,
    endWorkday,
    submitAbsenceJustification,
    getWeeklyHistory,
    getStreakCount,
    setShowAbsenceModal
  } = useTimeTracking();

  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false
  });

  const todayRecord = getTodayRecord();
  const currentSession = getCurrentSession();
  const weeklyHistory = getWeeklyHistory();
  const streakCount = getStreakCount();

  useEffect(() => {
    setMotivationalMessage(getRandomMotivationalMessage());
  }, []);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type, visible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleClockIn = () => {
    const session = clockIn();
    if (session) {
      showNotification('Entrada registrada com sucesso!', 'success');
    }
  };

  const handleClockOut = () => {
    const session = clockOut();
    if (session) {
      showNotification('Saída registrada com sucesso!', 'warning');
    }
  };

  const handleEndWorkday = () => {
    const record = endWorkday();
    const goalMet = record.goalMet;
    
    if (goalMet) {
      showNotification(`Meta cumprida: ${formatDuration(record.totalMinutes)}! Excelente trabalho.`, 'success');
    } else {
      showNotification(`Meta não atingida: ${formatDuration(record.totalMinutes)}. Recupere o ritmo amanhã.`, 'warning');
    }
  };

  const handleAbsenceJustification = (justification: string) => {
    submitAbsenceJustification(justification);
    showNotification('Justificativa enviada com sucesso!', 'info');
  };

  const getWorkStatus = () => {
    if (currentSession) {
      return 'Em expediente';
    }
    if (todayRecord.expedienteClosed) {
      return 'Expediente encerrado';
    }
    return 'Hoje ainda não iniciou';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'goal':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Meta
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Parcial
          </Badge>
        );
      case 'absence':
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/50">
            <XCircle className="h-3 w-3 mr-1" />
            Falta
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Clock className="h-3 w-3 mr-1" />
            Em andamento
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCurrentSessionDuration = () => {
    if (!currentSession) return 0;
    const start = new Date(currentSession.startTime);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / 60000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">TechFoco Inc.</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Funcionário</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {getGreeting()}, {user.name}!
                </h2>
                <p className="text-muted-foreground">
                  Hoje é {formatDate(currentTime)}
                </p>
                <p className="text-primary mt-2">
                  {motivationalMessage}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="text-3xl font-mono text-foreground">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-muted-foreground">Horário atual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Work Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p className="text-lg font-semibold">
                    {getWorkStatus()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Today's Hours */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Horas Hoje</p>
                  <p className="text-lg font-semibold">
                    {formatDuration(todayRecord.totalMinutes + getCurrentSessionDuration())}
                  </p>
                </div>
                <Hourglass className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Meta Diária</p>
                  <p className="text-lg font-semibold">
                    {getGoalProgress(todayRecord.totalMinutes + getCurrentSessionDuration())}% (3h)
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Streak */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Streak</p>
                  <p className="text-lg font-semibold">
                    {streakCount} dias
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Clock In/Out */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Registro de Ponto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Session */}
              {currentSession && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Sessão Atual</span>
                    <span className="text-sm font-mono">
                      {formatDuration(getCurrentSessionDuration())}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Entrada: {formatTime(new Date(currentSession.startTime))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={handleClockIn}
                  disabled={!!currentSession}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Bater Ponto Entrada
                </Button>
                <Button 
                  onClick={handleClockOut}
                  disabled={!currentSession}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Bater Ponto Saída
                </Button>
              </div>
              
              <Button 
                onClick={handleEndWorkday}
                disabled={todayRecord.expedienteClosed}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="mr-2 h-4 w-4" />
                Encerrar Expediente
              </Button>
            </CardContent>
          </Card>

          {/* Today's Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Sessões de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayRecord.sessions.length === 0 && !currentSession && (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma sessão registrada hoje
                  </p>
                )}
                
                {todayRecord.sessions.map((session, index) => (
                  <div key={session.id} className="bg-muted rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">
                        {formatTime(new Date(session.startTime))} - {' '}
                        {session.endTime ? formatTime(new Date(session.endTime)) : 'Em andamento'}
                      </div>
                      <div className="text-xs text-muted-foreground">Sessão {index + 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{formatDuration(session.duration)}</div>
                      <div className="text-xs text-green-400">
                        {session.status === 'active' ? 'Ativa' : 'Concluída'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentSession && (
                  <div className="bg-muted rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">
                        {formatTime(new Date(currentSession.startTime))} - {' '}
                        <span className="text-green-400">Em andamento</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sessão {todayRecord.sessions.length + 1}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{formatDuration(getCurrentSessionDuration())}</div>
                      <div className="text-xs text-green-400">Ativa</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Histórico Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Data</th>
                    <th className="text-left py-2">Horas</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyHistory.map((day) => (
                    <tr key={day.date} className="border-b">
                      <td className="py-3">{day.displayDate}</td>
                      <td className="py-3 font-mono">{formatDuration(day.totalMinutes)}</td>
                      <td className="py-3">
                        {getStatusBadge(day.status)}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {day.justification || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2024 TechFoco Inc. - Sistema de Ponto Eletrônico</p>
            <p>Desenvolvido para auxiliar no crescimento profissional</p>
          </div>
        </div>
      </footer>

      {/* Absence Modal */}
      <AbsenceModal
        isOpen={showAbsenceModal}
        date={pendingAbsenceDate}
        userName={user.name}
        onSubmit={handleAbsenceJustification}
      />

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={hideNotification}
      />
    </div>
  );
}
