// Online Database Service for Ponto Dev
// Uses JSONBin.io - Free online JSON storage without API key required
// Fallback to localStorage if online service fails

class OnlineDatabase {
    constructor() {
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
        this.binId = null;
        this.fallback = new PontoDevDatabase(); // Use local database as fallback
        this.isOnline = false;
        
        this.init();
    }
    
    async init() {
        // Try to load existing bin ID from localStorage
        this.binId = localStorage.getItem('ponto_dev_bin_id');
        
        if (this.binId) {
            // Test if existing bin is accessible
            try {
                await this.testConnection();
                this.isOnline = true;
                console.log('Conectado ao banco de dados online');
            } catch (error) {
                console.log('Falha na conexão online, usando armazenamento local');
                this.isOnline = false;
            }
        } else {
            // Create new bin
            await this.createBin();
        }
    }
    
    async createBin() {
        try {
            const initialData = {
                users: [],
                sessions: [],
                workdays: [],
                justifications: [],
                settings: [{
                    id: 'app_settings',
                    dailyTarget: 3 * 60 * 60 * 1000,
                    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    createdAt: new Date().toISOString()
                }],
                metadata: {
                    version: '1.0',
                    createdAt: new Date().toISOString(),
                    appName: 'Ponto Dev - TechFoco Inc.'
                }
            };
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(initialData)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.binId = result.metadata.id;
                localStorage.setItem('ponto_dev_bin_id', this.binId);
                this.isOnline = true;
                console.log('Banco de dados online criado com sucesso');
                
                // Show success message to user
                this.showMessage('Banco de dados online conectado com sucesso!', 'success');
            } else {
                throw new Error('Falha ao criar banco de dados online');
            }
        } catch (error) {
            console.log('Erro ao criar banco online, usando armazenamento local:', error);
            this.isOnline = false;
            this.showMessage('Usando armazenamento local (offline)', 'warning');
        }
    }
    
    async testConnection() {
        const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('Conexão falhou');
        }
        
        return await response.json();
    }
    
    async getData() {
        if (!this.isOnline) {
            return this.getLocalData();
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.record;
            } else {
                throw new Error('Falha ao buscar dados');
            }
        } catch (error) {
            console.log('Erro ao buscar dados online, usando local:', error);
            return this.getLocalData();
        }
    }
    
    async saveData(data) {
        // Always save locally first
        this.saveLocalData(data);
        
        if (!this.isOnline) {
            return true;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    metadata: {
                        ...data.metadata,
                        lastUpdated: new Date().toISOString()
                    }
                })
            });
            
            if (response.ok) {
                console.log('Dados salvos online com sucesso');
                return true;
            } else {
                throw new Error('Falha ao salvar dados online');
            }
        } catch (error) {
            console.log('Erro ao salvar online, dados mantidos localmente:', error);
            return false;
        }
    }
    
    getLocalData() {
        const localData = {
            users: this.fallback.getCollection('users'),
            sessions: this.fallback.getCollection('sessions'),
            workdays: this.fallback.getCollection('workdays'),
            justifications: this.fallback.getCollection('justifications'),
            settings: this.fallback.getCollection('settings'),
            metadata: {
                version: '1.0',
                source: 'local',
                lastUpdated: new Date().toISOString()
            }
        };
        
        return localData;
    }
    
    saveLocalData(data) {
        if (data.users) this.fallback.saveCollection('users', data.users);
        if (data.sessions) this.fallback.saveCollection('sessions', data.sessions);
        if (data.workdays) this.fallback.saveCollection('workdays', data.workdays);
        if (data.justifications) this.fallback.saveCollection('justifications', data.justifications);
        if (data.settings) this.fallback.saveCollection('settings', data.settings);
    }
    
    // High-level methods for the app
    async getUserSessions(userId, date) {
        const data = await this.getData();
        const dateKey = this.getDateKey(date);
        
        return data.sessions.filter(session => 
            session.userId === userId && session.date === dateKey
        );
    }
    
    async saveUserSession(userId, sessionData) {
        const data = await this.getData();
        const dateKey = this.getDateKey(new Date(sessionData.startTime));
        
        const newSession = {
            id: this.generateId(),
            userId: userId,
            date: dateKey,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            duration: sessionData.duration,
            startTimeDisplay: sessionData.startTimeDisplay,
            endTimeDisplay: sessionData.endTimeDisplay,
            durationDisplay: sessionData.durationDisplay,
            createdAt: new Date().toISOString()
        };
        
        data.sessions.push(newSession);
        await this.saveData(data);
        
        return newSession;
    }
    
    async getUserWorkday(userId, date) {
        const data = await this.getData();
        const dateKey = this.getDateKey(date);
        
        return data.workdays.find(workday => 
            workday.userId === userId && workday.date === dateKey
        );
    }
    
    async saveUserWorkday(userId, date, workdayData) {
        const data = await this.getData();
        const dateKey = this.getDateKey(date);
        
        const existingIndex = data.workdays.findIndex(workday => 
            workday.userId === userId && workday.date === dateKey
        );
        
        const workday = {
            id: existingIndex >= 0 ? data.workdays[existingIndex].id : this.generateId(),
            userId: userId,
            date: dateKey,
            ...workdayData,
            updatedAt: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            data.workdays[existingIndex] = workday;
        } else {
            workday.createdAt = new Date().toISOString();
            data.workdays.push(workday);
        }
        
        await this.saveData(data);
        return workday;
    }
    
    async saveJustification(userId, date, justificationText) {
        const data = await this.getData();
        const dateKey = this.getDateKey(date);
        
        const justification = {
            id: this.generateId(),
            userId: userId,
            date: dateKey,
            text: justificationText,
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        data.justifications.push(justification);
        await this.saveData(data);
        
        return justification;
    }
    
    async getUserWeeklyHistory(userId, endDate, days = 7) {
        const data = await this.getData();
        const history = [];
        const currentDate = new Date(endDate);
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            
            const dateKey = this.getDateKey(date);
            const sessions = data.sessions.filter(session => 
                session.userId === userId && session.date === dateKey
            );
            const workday = data.workdays.find(workday => 
                workday.userId === userId && workday.date === dateKey
            );
            const justification = data.justifications.find(just => 
                just.userId === userId && just.date === dateKey
            );
            
            history.push({
                date: date,
                dateKey: dateKey,
                sessions: sessions,
                workday: workday,
                justification: justification,
                totalTime: this.calculateTotalTime(sessions)
            });
        }
        
        return history;
    }
    
    async getUserStats(userId, startDate, endDate) {
        const data = await this.getData();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const sessions = data.sessions.filter(session => {
            if (session.userId !== userId) return false;
            const sessionDate = new Date(session.startTime);
            return sessionDate >= start && sessionDate <= end;
        });
        
        const totalTime = this.calculateTotalTime(sessions);
        const days = this.getDaysBetween(start, end);
        const avgDailyTime = days > 0 ? totalTime / days : 0;
        
        const completedDays = data.workdays.filter(workday => {
            if (workday.userId !== userId || !workday.workdayCompleted) return false;
            const workdayDate = this.parseDate(workday.date);
            return workdayDate >= start && workdayDate <= end;
        }).length;
        
        return {
            totalTime: totalTime,
            averageDailyTime: avgDailyTime,
            completedDays: completedDays,
            totalSessions: sessions.length,
            productivity: totalTime / (3 * 60 * 60 * 1000) // Compared to 3-hour target
        };
    }
    
    // Export/Import functionality
    async exportData() {
        const data = await this.getData();
        return {
            exportDate: new Date().toISOString(),
            version: '1.0',
            source: this.isOnline ? 'online' : 'local',
            binId: this.binId,
            data: data
        };
    }
    
    async importData(exportedData) {
        if (!exportedData.data) throw new Error('Formato de dados inválido');
        
        await this.saveData(exportedData.data);
        
        if (exportedData.binId && exportedData.binId !== this.binId) {
            // Option to switch to imported bin
            const switchBin = confirm('Deseja usar o banco de dados do arquivo importado?');
            if (switchBin) {
                this.binId = exportedData.binId;
                localStorage.setItem('ponto_dev_bin_id', this.binId);
                await this.testConnection();
            }
        }
        
        return true;
    }
    
    // Sync methods
    async syncWithLocal() {
        if (!this.isOnline) return false;
        
        try {
            const localData = this.getLocalData();
            const onlineData = await this.getData();
            
            // Simple merge strategy - online data takes precedence
            const mergedData = {
                users: [...localData.users, ...onlineData.users],
                sessions: [...localData.sessions, ...onlineData.sessions],
                workdays: [...localData.workdays, ...onlineData.workdays],
                justifications: [...localData.justifications, ...onlineData.justifications],
                settings: onlineData.settings.length > 0 ? onlineData.settings : localData.settings,
                metadata: {
                    version: '1.0',
                    lastSynced: new Date().toISOString(),
                    source: 'merged'
                }
            };
            
            // Remove duplicates
            mergedData.users = this.removeDuplicates(mergedData.users, 'id');
            mergedData.sessions = this.removeDuplicates(mergedData.sessions, 'id');
            mergedData.workdays = this.removeDuplicates(mergedData.workdays, 'id');
            mergedData.justifications = this.removeDuplicates(mergedData.justifications, 'id');
            
            await this.saveData(mergedData);
            this.showMessage('Dados sincronizados com sucesso!', 'success');
            
            return true;
        } catch (error) {
            console.log('Erro na sincronização:', error);
            this.showMessage('Falha na sincronização', 'error');
            return false;
        }
    }
    
    // Helper methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }
    
    parseDate(dateKey) {
        return new Date(dateKey + 'T00:00:00');
    }
    
    calculateTotalTime(sessions) {
        return sessions.reduce((total, session) => total + (session.duration || 0), 0);
    }
    
    getDaysBetween(start, end) {
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    removeDuplicates(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
    
    showMessage(message, type = 'info') {
        // This will be implemented in the main script
        if (window.pontoDevSystem && window.pontoDevSystem.showMessage) {
            window.pontoDevSystem.showMessage(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Status methods
    getStatus() {
        return {
            isOnline: this.isOnline,
            binId: this.binId,
            hasLocalData: this.fallback.getCollection('sessions').length > 0,
            lastSync: localStorage.getItem('ponto_dev_last_sync')
        };
    }
    
    async reconnect() {
        if (this.binId) {
            try {
                await this.testConnection();
                this.isOnline = true;
                this.showMessage('Reconectado ao banco de dados online!', 'success');
                return true;
            } catch (error) {
                this.showMessage('Falha na reconexão', 'error');
                return false;
            }
        }
        return false;
    }
}

// Export for use in other files
window.OnlineDatabase = OnlineDatabase;