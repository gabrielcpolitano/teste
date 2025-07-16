// Ponto Dev - TechFoco Inc. Lesson System
// Professional corporate-style lesson tracking for study discipline

class PontoDevSystem {
    constructor() {
        this.currentUser = null;
        this.isDayStarted = false;
        this.lessons = {
            b7web1: false,
            b7web2: false,
            b7web3: false,
            b7web4: false,
            b7web5: false
        };
        this.motivationalMessages = [
            "Hoje você precisa completar 5 aulas do B7Web para manter seu progresso!",
            "Cada aula concluída é um passo para o seu sucesso profissional.",
            "A constância nos estudos é a chave para o crescimento na carreira.",
            "Mantenha o foco e complete todas as 5 aulas de hoje.",
            "Sua dedicação hoje constrói o futuro que você deseja.",
            "Excelência se constrói uma aula por vez.",
            "Transforme conhecimento em resultados excepcionais."
        ];
        
        this.init();
    }

    init() {
        this.migrateData();
        this.setupEventListeners();
        this.updateClock();
        this.checkForAbsences();
        this.loadUserData();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    migrateData() {
        // Clear any old data that might have FIAP lessons
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('pontodev_')) {
                const data = JSON.parse(localStorage.getItem(key));
                if (data && data.lessons) {
                    // Remove FIAP lessons from old data
                    const filteredLessons = {};
                    Object.keys(data.lessons).forEach(lessonKey => {
                        if (lessonKey.startsWith('b7web')) {
                            filteredLessons[lessonKey] = data.lessons[lessonKey];
                        }
                    });
                    data.lessons = filteredLessons;
                    localStorage.setItem(key, JSON.stringify(data));
                }
            }
        });
    }

    setupEventListeners() {
        // Login screen
        document.getElementById('startWorkdayBtn').addEventListener('click', () => this.startWorkday());
        
        // Dashboard controls
        document.getElementById('endWorkdayBtn').addEventListener('click', () => this.endWorkday());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Lesson checkboxes
        for (let i = 1; i <= 5; i++) {
            const checkbox = document.getElementById(`b7web${i}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.toggleLesson(`b7web${i}`));
            }
        }
        
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
        
        setTimeout(() => this.updateClock(), 1000);
    }

    startWorkday() {
        const nameInput = document.getElementById('employeeName');
        const userName = nameInput.value.trim() || 'Gabriel';
        
        this.currentUser = userName;
        this.isDayStarted = true;
        
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
        
        // Random motivational message
        const randomMessage = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        document.getElementById('motivationalMessage').textContent = randomMessage;
        
        // Update day status
        this.updateDayStatus();
        
        // Load today's data
        this.loadTodaysData();
        
        // Update lesson progress
        this.updateLessonProgress();
        
        // Update weekly history
        this.updateWeeklyHistory();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    updateDayStatus() {
        const completedCount = Object.values(this.lessons).filter(Boolean).length;
        const statusElement = document.getElementById('dayStatus');
        
        if (statusElement) {
            if (completedCount < 5) {
                statusElement.textContent = 'Dia iniciado';
            } else {
                statusElement.textContent = 'Dia concluído';
            }
        }
    }

    toggleLesson(lessonId) {
        const checkbox = document.getElementById(lessonId);
        const timeElement = document.getElementById(`${lessonId}-time`);
        
        this.lessons[lessonId] = checkbox.checked;
        
        if (checkbox.checked) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = `Concluída às ${timeString}`;
            timeElement.classList.add('text-green-400');
            timeElement.classList.remove('text-gray-400');
            
            this.showMessage(`Aula B7Web concluída! Parabéns!`, 'success');
            this.playSound('success');
        } else {
            timeElement.textContent = 'Não iniciada';
            timeElement.classList.remove('text-green-400');
            timeElement.classList.add('text-gray-400');
        }
        
        this.updateLessonProgress();
        this.updateDayStatus();
        this.saveTodaysData();
    }

    updateLessonProgress() {
        const completedCount = Object.values(this.lessons).filter(Boolean).length;
        const progressPercent = (completedCount / 5) * 100;
        
        // Update completed lessons counter
        const completedElement = document.getElementById('completedLessons');
        if (completedElement) {
            completedElement.textContent = `${completedCount}/5`;
        }
        
        // Update progress bar
        const progressBarElement = document.getElementById('progressBar');
        if (progressBarElement) {
            progressBarElement.style.width = `${progressPercent}%`;
        }
        
        // Check if all lessons are complete
        if (completedCount === 5) {
            this.showMessage('Parabéns! Você concluiu todas as 5 aulas de hoje!', 'success', 5000);
            this.playSound('complete');
        }
    }

    endWorkday() {
        const completedCount = Object.values(this.lessons).filter(Boolean).length;
        
        if (completedCount < 5) {
            if (!confirm(`Você só concluiu ${completedCount} de 5 aulas. Tem certeza que deseja finalizar o dia?`)) {
                return;
            }
        }
        
        this.saveTodaysData();
        this.showMessage('Dia finalizado com sucesso!', 'success');
        
        // Reset for next day
        setTimeout(() => {
            this.logout();
        }, 2000);
    }

    checkForAbsences() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = this.getDateKey(yesterday);
        
        const yesterdayData = this.getDateData(yesterdayKey);
        
        if (!yesterdayData || Object.values(yesterdayData.lessons || {}).filter(Boolean).length === 0) {
            this.showAbsenceModal(yesterday);
        }
    }

    showAbsenceModal(date) {
        const modal = document.getElementById('absenceModal');
        const message = document.getElementById('absenceMessage');
        
        const dateStr = date.toLocaleDateString('pt-BR');
        message.textContent = `Ontem, dia ${dateStr}, você não registrou nenhuma aula. Por favor, insira uma justificativa profissional para a ausência.`;
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-backdrop');
    }

    submitJustification() {
        const justification = document.getElementById('absenceJustification').value.trim();
        
        if (!justification) {
            this.showMessage('Por favor, insira uma justificativa.', 'error');
            return;
        }
        
        // Save justification
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = this.getDateKey(yesterday);
        
        const yesterdayData = this.getDateData(yesterdayKey) || {};
        yesterdayData.justification = justification;
        yesterdayData.lessons = {};
        
        this.saveDateData(yesterdayKey, yesterdayData);
        
        document.getElementById('absenceModal').classList.add('hidden');
        document.getElementById('absenceJustification').value = '';
        
        this.showMessage('Justificativa enviada com sucesso!', 'success');
    }

    loadTodaysData() {
        const todaysData = this.getTodaysData();
        
        if (todaysData && todaysData.lessons) {
            this.lessons = { ...todaysData.lessons };
            
            // Update checkboxes and times
            for (let i = 1; i <= 5; i++) {
                const lessonId = `b7web${i}`;
                const checkbox = document.getElementById(lessonId);
                const timeElement = document.getElementById(`${lessonId}-time`);
                
                if (checkbox) {
                    checkbox.checked = this.lessons[lessonId] || false;
                    
                    if (checkbox.checked && todaysData.lessonTimes && todaysData.lessonTimes[lessonId]) {
                        timeElement.textContent = `Concluída às ${todaysData.lessonTimes[lessonId]}`;
                        timeElement.classList.add('text-green-400');
                        timeElement.classList.remove('text-gray-400');
                    }
                }
            }
        }
        
        this.updateLessonProgress();
    }

    updateWeeklyHistory() {
        const historyContainer = document.getElementById('weeklyHistory');
        historyContainer.innerHTML = '';
        
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = this.getDateKey(date);
            const dateData = this.getDateData(dateKey);
            
            const completedCount = dateData && dateData.lessons ? 
                Object.values(dateData.lessons).filter(Boolean).length : 0;
            
            const isToday = i === 0;
            const dateStr = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
            
            let statusClass = 'error';
            let statusText = 'Não estudou';
            
            if (completedCount === 5) {
                statusClass = 'success';
                statusText = '5/5 aulas';
            } else if (completedCount > 0) {
                statusClass = 'warning';
                statusText = `${completedCount}/5 aulas`;
            } else if (dateData && dateData.justification) {
                statusClass = 'warning';
                statusText = 'Justificado';
            }
            
            if (isToday && completedCount === 0) {
                statusText = 'Hoje';
                statusClass = 'warning';
            }
            
            const historyCard = document.createElement('div');
            historyCard.className = `history-card ${statusClass}`;
            historyCard.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white font-medium">${dateStr}${isToday ? ' (Hoje)' : ''}</p>
                        <p class="text-sm text-gray-400">${statusText}</p>
                    </div>
                    <div class="text-right">
                        <div class="w-4 h-4 rounded-full ${statusClass === 'success' ? 'bg-green-500' : 
                            statusClass === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}"></div>
                    </div>
                </div>
            `;
            
            historyContainer.appendChild(historyCard);
        }
    }

    getTodaysData() {
        const today = new Date();
        const dateKey = this.getDateKey(today);
        return this.getDateData(dateKey);
    }

    getDateData(dateKey) {
        return JSON.parse(localStorage.getItem(`pontodev_${dateKey}`)) || null;
    }

    saveTodaysData() {
        const today = new Date();
        const dateKey = this.getDateKey(today);
        
        const lessonTimes = {};
        for (let i = 1; i <= 5; i++) {
            const lessonId = `b7web${i}`;
            if (this.lessons[lessonId]) {
                const timeElement = document.getElementById(`${lessonId}-time`);
                if (timeElement && timeElement.textContent.includes('Concluída às')) {
                    lessonTimes[lessonId] = timeElement.textContent.replace('Concluída às ', '');
                }
            }
        }
        
        const data = {
            lessons: this.lessons,
            lessonTimes: lessonTimes,
            user: this.currentUser,
            date: today.toISOString()
        };
        
        this.saveDateData(dateKey, data);
    }

    saveDateData(dateKey, data) {
        localStorage.setItem(`pontodev_${dateKey}`, JSON.stringify(data));
    }

    getDateKey(date) {
        return date.toISOString().split('T')[0];
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
        // Create audio context for sound feedback
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            } else if (type === 'complete') {
                oscillator.frequency.value = 1200;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            }
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    loadUserData() {
        const userData = localStorage.getItem('pontodev_user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.name) {
                document.getElementById('employeeName').value = user.name;
            }
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
        this.currentUser = null;
        this.isDayStarted = false;
        this.lessons = {
            b7web1: false,
            b7web2: false,
            b7web3: false,
            b7web4: false,
            b7web5: false,
            fiap1: false,
            fiap2: false,
            fiap3: false,
            fiap4: false,
            fiap5: false
        };
        
        // Show login screen
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('welcomeMessage').classList.add('hidden');
        
        // Reset form
        document.getElementById('employeeName').value = 'Gabriel';
        
        this.showMessage('Logout realizado com sucesso!', 'success');
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PontoDevSystem();
    console.log('Ponto Dev System loaded successfully');
});
