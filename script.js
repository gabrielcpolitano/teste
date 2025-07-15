// Ponto Dev - TechFoco Inc. Time Tracking System
// Professional corporate-style time tracking for study discipline

class PontoDevSystem {
    constructor() {
        this.currentUser = null;
        this.currentSession = null;
        this.isWorkdayStarted = false;
        this.motivationalMessages = [
            "Hoje é mais um dia para alcançar seus objetivos na TechFoco Inc.",
            "Sua dedicação hoje constrói o sucesso de amanhã.",
            "Cada hora de estudo é um investimento no seu futuro profissional.",
            "A consistência é a chave para o crescimento na carreira.",
            "Mais um dia para demonstrar sua excelência técnica.",
            "Seu comprometimento faz a diferença na TechFoco Inc.",
            "Transforme conhecimento em resultados excepcionais."
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.checkForAbsences();
        this.loadUserData();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    setupEventListeners() {
        // Login screen
        document.getElementById('startWorkdayBtn').addEventListener('click', () => this.startWorkday());
        
        // Dashboard controls
        document.getElementById('clockInBtn').addEventListener('click', () => this.clockIn());
        document.getElementById('clockOutBtn').addEventListener('click', () => this.clockOut());
        document.getElementById('endWorkdayBtn').addEventListener('click', () => this.endWorkday());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Absence justification
        document.getElementById('submitJustificationBtn').addEventListener('click', () => this.submitJustification());
        
        // Enter key support
        document.getElementById('employeeName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startWorkday();
        });
        
        document.getElementById('absenceJustification').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.submitJustification();
        });
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const clockElement = document.getElementById('currentTime');
        if (clockElement) {
            clockElement.textContent = timeString;
            clockElement.classList.add('clock-display');
        }
        
        // Update session time if active
        if (this.currentSession) {
            this.updateSessionTime();
        }
        
        // Update daily total
        this.updateDailyTotal();
        
        setTimeout(() => this.updateClock(), 1000);
    }

    startWorkday() {
        const nameInput = document.getElementById('employeeName');
        const userName = nameInput.value.trim() || 'Gabriel';
        
        this.currentUser = userName;
        this.isWorkdayStarted = true;
        
        // Show welcome message
        const welcomeMsg = document.getElementById('welcomeMessage');
        welcomeMsg.classList.remove('hidden');
        welcomeMsg.classList.add('animate-fade-in');
        
        // Switch to dashboard after delay
        setTimeout(() => {
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            this.updateDashboard();
        }, 2000);
    }

    updateDashboard() {
        // Update user name
        document.getElementById('employeeNameDisplay').textContent = this.currentUser;
        
        // Update greeting based on time
        const now = new Date();
        const hour = now.getHours();
        let greeting = 'Bom dia';
        
        if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
        else if (hour >= 18) greeting = 'Boa noite';
        
        document.getElementById('dailyGreeting').textContent = `${greeting}, ${this.currentUser}!`;
        
        // Random motivational message
        const randomMessage = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        document.getElementById('motivationalMessage').textContent = randomMessage;
        
        // Update work status
        this.updateWorkStatus();
        
        // Load today's data
        this.loadTodaysData();
        
        // Update weekly history
        this.updateWeeklyHistory();
    }

    updateWorkStatus() {
        const statusElement = document.getElementById('workStatus');
        
        if (this.currentSession) {
            statusElement.textContent = 'Você está em expediente';
            statusElement.className = 'text-lg font-semibold text-green-400';
        } else if (this.isWorkdayStarted) {
            statusElement.textContent = 'Expediente iniciado - Aguardando entrada';
            statusElement.className = 'text-lg font-semibold text-yellow-400';
        } else {
            statusElement.textContent = 'Expediente não iniciado';
            statusElement.className = 'text-lg font-semibold text-gray-400';
        }
    }

    clockIn() {
        if (this.currentSession) {
            this.showMessage('Você já está em uma sessão ativa!', 'error');
            return;
        }
        
        const now = new Date();
        this.currentSession = {
            startTime: now.toISOString(),
            startTimeDisplay: now.toLocaleTimeString('pt-BR', { hour12: false })
        };
        
        // Update button states
        document.getElementById('clockInBtn').disabled = true;
        document.getElementById('clockOutBtn').disabled = false;
        
        this.updateWorkStatus();
        this.updateSessionsDisplay();
        this.showMessage('Ponto de entrada registrado com sucesso!', 'success');
        
        // Play sound effect (optional)
        this.playSound('clockIn');
    }

    clockOut() {
        if (!this.currentSession) {
            this.showMessage('Nenhuma sessão ativa para encerrar!', 'error');
            return;
        }
        
        const now = new Date();
        const startTime = new Date(this.currentSession.startTime);
        const duration = now - startTime;
        
        // Save session to localStorage
        const session = {
            ...this.currentSession,
            endTime: now.toISOString(),
            endTimeDisplay: now.toLocaleTimeString('pt-BR', { hour12: false }),
            duration: duration,
            durationDisplay: this.formatDuration(duration)
        };
        
        this.saveTodaysSession(session);
        this.currentSession = null;
        
        // Update button states
        document.getElementById('clockInBtn').disabled = false;
        document.getElementById('clockOutBtn').disabled = true;
        
        this.updateWorkStatus();
        this.updateSessionsDisplay();
        this.showMessage('Ponto de saída registrado com sucesso!', 'success');
        
        // Play sound effect (optional)
        this.playSound('clockOut');
    }

    endWorkday() {
        const todayData = this.getTodaysData();
        const totalTime = this.calculateTotalTime(todayData.sessions);
        const targetTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        
        // Force clock out if session is active
        if (this.currentSession) {
            this.clockOut();
        }
        
        // Save workday as completed
        todayData.workdayCompleted = true;
        todayData.completedAt = new Date().toISOString();
        this.saveTodaysData(todayData);
        
        // Show final message
        const totalTimeFormatted = this.formatDuration(totalTime);
        let message, messageType;
        
        if (totalTime >= targetTime) {
            message = `✅ Meta cumprida: ${totalTimeFormatted} – Excelente trabalho, ${this.currentUser}!`;
            messageType = 'success';
        } else {
            message = `⚠️ Meta não atingida: ${totalTimeFormatted} – Recupere o ritmo amanhã.`;
            messageType = 'warning';
        }
        
        this.showMessage(message, messageType, 5000);
        
        // Reset for next day
        this.isWorkdayStarted = false;
        this.updateWorkStatus();
        this.updateWeeklyHistory();
    }

    checkForAbsences() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = this.getDateKey(yesterday);
        
        const yesterdayData = this.getDateData(yesterdayKey);
        
        if (!yesterdayData.workdayCompleted && !yesterdayData.justification) {
            this.showAbsenceModal(yesterday);
        }
    }

    showAbsenceModal(date) {
        const modal = document.getElementById('absenceModal');
        const messageElement = document.getElementById('absenceMessage');
        
        const dateString = date.toLocaleDateString('pt-BR');
        messageElement.textContent = `Ontem, dia ${dateString}, você não registrou expediente. Por favor, insira uma justificativa profissional para a ausência.`;
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-backdrop');
        
        // Store the date for justification
        this.pendingJustificationDate = date;
    }

    submitJustification() {
        const justificationText = document.getElementById('absenceJustification').value.trim();
        
        if (!justificationText) {
            this.showMessage('Por favor, digite uma justificativa.', 'error');
            return;
        }
        
        const dateKey = this.getDateKey(this.pendingJustificationDate);
        const dateData = this.getDateData(dateKey);
        
        dateData.justification = justificationText;
        dateData.justificationDate = new Date().toISOString();
        
        this.saveDateData(dateKey, dateData);
        
        // Hide modal
        document.getElementById('absenceModal').classList.add('hidden');
        document.getElementById('absenceJustification').value = '';
        
        this.showMessage('Justificativa enviada com sucesso!', 'success');
        this.updateWeeklyHistory();
    }

    loadTodaysData() {
        const todayData = this.getTodaysData();
        this.updateSessionsDisplay();
        this.updateDailyTotal();
    }

    updateSessionsDisplay() {
        const sessionsContainer = document.getElementById('dailySessions');
        const todayData = this.getTodaysData();
        
        if (todayData.sessions.length === 0 && !this.currentSession) {
            sessionsContainer.innerHTML = '<p class="text-gray-400 text-center py-4">Nenhuma sessão registrada hoje</p>';
            return;
        }
        
        let html = '';
        
        // Show completed sessions
        todayData.sessions.forEach((session, index) => {
            html += `
                <div class="session-card">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium text-white">Sessão ${index + 1}</p>
                            <p class="text-sm text-gray-400">${session.startTimeDisplay} - ${session.endTimeDisplay}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-green-400">${session.durationDisplay}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Show active session
        if (this.currentSession) {
            html += `
                <div class="session-card active">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium text-white">Sessão Ativa</p>
                            <p class="text-sm text-gray-400">Iniciada às ${this.currentSession.startTimeDisplay}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-green-400" id="currentSessionTime">00:00:00</p>
                            <p class="text-xs text-gray-400">em andamento</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        sessionsContainer.innerHTML = html;
    }

    updateSessionTime() {
        const sessionTimeElement = document.getElementById('currentSessionTime');
        if (sessionTimeElement && this.currentSession) {
            const now = new Date();
            const startTime = new Date(this.currentSession.startTime);
            const duration = now - startTime;
            sessionTimeElement.textContent = this.formatDuration(duration);
        }
    }

    updateDailyTotal() {
        const todayData = this.getTodaysData();
        let totalTime = this.calculateTotalTime(todayData.sessions);
        
        // Add current session time if active
        if (this.currentSession) {
            const now = new Date();
            const startTime = new Date(this.currentSession.startTime);
            totalTime += (now - startTime);
        }
        
        const totalTimeElement = document.getElementById('todayTime');
        if (totalTimeElement) {
            totalTimeElement.textContent = this.formatDuration(totalTime);
        }
    }

    updateWeeklyHistory() {
        const historyContainer = document.getElementById('weeklyHistory');
        const today = new Date();
        let html = '';
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            const dateData = this.getDateData(dateKey);
            
            const totalTime = this.calculateTotalTime(dateData.sessions);
            const targetTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
            
            let status = 'error';
            let statusText = '❌ Não registrado';
            let statusClass = 'error';
            
            if (dateData.workdayCompleted) {
                if (totalTime >= targetTime) {
                    status = 'success';
                    statusText = '✅ Meta atingida';
                    statusClass = 'success';
                } else {
                    status = 'warning';
                    statusText = '⚠️ Meta parcial';
                    statusClass = 'warning';
                }
            } else if (dateData.justification) {
                status = 'warning';
                statusText = '⚠️ Justificado';
                statusClass = 'warning';
            }
            
            const dateString = date.toLocaleDateString('pt-BR', { 
                weekday: 'short', 
                day: '2-digit', 
                month: '2-digit' 
            });
            
            html += `
                <div class="history-card ${statusClass}">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium text-white">${dateString}</p>
                            <p class="text-sm text-gray-400">${this.formatDuration(totalTime)} estudado</p>
                            ${dateData.justification ? `<p class="text-xs text-gray-500 mt-1">Justificativa: ${dateData.justification.substring(0, 50)}...</p>` : ''}
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">${statusText}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        historyContainer.innerHTML = html;
    }

    // Data management methods
    getTodaysData() {
        const today = new Date();
        const dateKey = this.getDateKey(today);
        return this.getDateData(dateKey);
    }

    getDateData(dateKey) {
        const data = localStorage.getItem(`pontodev_${dateKey}`);
        return data ? JSON.parse(data) : {
            date: dateKey,
            sessions: [],
            workdayCompleted: false,
            justification: null
        };
    }

    saveTodaysData(data) {
        const today = new Date();
        const dateKey = this.getDateKey(today);
        this.saveDateData(dateKey, data);
    }

    saveDateData(dateKey, data) {
        localStorage.setItem(`pontodev_${dateKey}`, JSON.stringify(data));
    }

    saveTodaysSession(session) {
        const todayData = this.getTodaysData();
        todayData.sessions.push(session);
        this.saveTodaysData(todayData);
    }

    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    calculateTotalTime(sessions) {
        return sessions.reduce((total, session) => total + (session.duration || 0), 0);
    }

    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showMessage(message, type = 'success', duration = 3000) {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `notification ${type}`;
        messageDiv.textContent = message;
        
        container.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, duration);
    }

    playSound(type) {
        // Optional: Add sound effects
        // This would require audio files or Web Audio API
        console.log(`Sound: ${type}`);
    }

    loadUserData() {
        const userData = localStorage.getItem('pontodev_user');
        if (userData) {
            const data = JSON.parse(userData);
            this.currentUser = data.name;
        }
    }

    logout() {
        // Save user data
        if (this.currentUser) {
            localStorage.setItem('pontodev_user', JSON.stringify({
                name: this.currentUser,
                lastLogin: new Date().toISOString()
            }));
        }
        
        // Reset state
        this.currentSession = null;
        this.isWorkdayStarted = false;
        
        // Return to login screen
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        
        // Reset login form
        document.getElementById('welcomeMessage').classList.add('hidden');
        document.getElementById('employeeName').value = this.currentUser || 'Gabriel';
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PontoDevSystem();
});

// Additional utility functions
function formatTimeForDisplay(date) {
    return date.toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getGreetingMessage(hour) {
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

// Service worker registration (optional for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Could register a service worker here for offline functionality
        console.log('Ponto Dev System loaded successfully');
    });
}
