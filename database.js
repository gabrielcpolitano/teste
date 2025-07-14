// Simple Mock Database for Ponto Dev
// Simulates a real database with collections and queries
// All data is stored in LocalStorage but accessed through database-like methods

class PontoDevDatabase {
    constructor() {
        this.collections = {
            users: 'ponto_dev_users',
            sessions: 'ponto_dev_sessions',
            workdays: 'ponto_dev_workdays',
            justifications: 'ponto_dev_justifications',
            settings: 'ponto_dev_settings'
        };
        
        this.init();
    }
    
    init() {
        // Initialize collections if they don't exist
        Object.values(this.collections).forEach(collection => {
            if (!localStorage.getItem(collection)) {
                localStorage.setItem(collection, JSON.stringify([]));
            }
        });
        
        // Initialize settings
        const settings = this.getCollection('settings');
        if (settings.length === 0) {
            this.insert('settings', {
                id: 'app_settings',
                dailyTarget: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                createdAt: new Date().toISOString()
            });
        }
    }
    
    // Get all records from a collection
    getCollection(collectionName) {
        const key = this.collections[collectionName];
        if (!key) throw new Error(`Collection '${collectionName}' not found`);
        
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
    
    // Save collection data
    saveCollection(collectionName, data) {
        const key = this.collections[collectionName];
        if (!key) throw new Error(`Collection '${collectionName}' not found`);
        
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    // Insert a new record
    insert(collectionName, record) {
        const collection = this.getCollection(collectionName);
        
        // Add ID if not present
        if (!record.id) {
            record.id = this.generateId();
        }
        
        // Add timestamps
        record.createdAt = record.createdAt || new Date().toISOString();
        record.updatedAt = new Date().toISOString();
        
        collection.push(record);
        this.saveCollection(collectionName, collection);
        
        return record;
    }
    
    // Find records by query
    find(collectionName, query = {}) {
        const collection = this.getCollection(collectionName);
        
        if (Object.keys(query).length === 0) {
            return collection;
        }
        
        return collection.filter(record => {
            return Object.entries(query).every(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    // Handle operators like $gte, $lte, $in, etc.
                    return this.applyOperators(record[key], value);
                }
                return record[key] === value;
            });
        });
    }
    
    // Find one record
    findOne(collectionName, query = {}) {
        const results = this.find(collectionName, query);
        return results.length > 0 ? results[0] : null;
    }
    
    // Update records
    update(collectionName, query, updates) {
        const collection = this.getCollection(collectionName);
        let updatedCount = 0;
        
        const updatedCollection = collection.map(record => {
            const matches = Object.entries(query).every(([key, value]) => record[key] === value);
            
            if (matches) {
                updatedCount++;
                return {
                    ...record,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
            }
            
            return record;
        });
        
        this.saveCollection(collectionName, updatedCollection);
        return updatedCount;
    }
    
    // Delete records
    delete(collectionName, query) {
        const collection = this.getCollection(collectionName);
        const filteredCollection = collection.filter(record => {
            return !Object.entries(query).every(([key, value]) => record[key] === value);
        });
        
        const deletedCount = collection.length - filteredCollection.length;
        this.saveCollection(collectionName, filteredCollection);
        
        return deletedCount;
    }
    
    // Get user sessions for a specific date
    getUserSessions(userId, date) {
        const dateKey = this.getDateKey(date);
        return this.find('sessions', {
            userId: userId,
            date: dateKey
        });
    }
    
    // Get user workday data
    getUserWorkday(userId, date) {
        const dateKey = this.getDateKey(date);
        return this.findOne('workdays', {
            userId: userId,
            date: dateKey
        });
    }
    
    // Save user session
    saveUserSession(userId, sessionData) {
        const dateKey = this.getDateKey(new Date(sessionData.startTime));
        
        return this.insert('sessions', {
            userId: userId,
            date: dateKey,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            duration: sessionData.duration,
            startTimeDisplay: sessionData.startTimeDisplay,
            endTimeDisplay: sessionData.endTimeDisplay,
            durationDisplay: sessionData.durationDisplay
        });
    }
    
    // Save or update workday
    saveUserWorkday(userId, date, workdayData) {
        const dateKey = this.getDateKey(date);
        const existing = this.findOne('workdays', {
            userId: userId,
            date: dateKey
        });
        
        if (existing) {
            this.update('workdays', { id: existing.id }, workdayData);
        } else {
            this.insert('workdays', {
                userId: userId,
                date: dateKey,
                ...workdayData
            });
        }
    }
    
    // Get user weekly history
    getUserWeeklyHistory(userId, endDate, days = 7) {
        const history = [];
        const currentDate = new Date(endDate);
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            
            const dateKey = this.getDateKey(date);
            const sessions = this.getUserSessions(userId, date);
            const workday = this.getUserWorkday(userId, date);
            const justification = this.findOne('justifications', {
                userId: userId,
                date: dateKey
            });
            
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
    
    // Save justification
    saveJustification(userId, date, justificationText) {
        const dateKey = this.getDateKey(date);
        
        return this.insert('justifications', {
            userId: userId,
            date: dateKey,
            text: justificationText,
            submittedAt: new Date().toISOString()
        });
    }
    
    // Analytics methods
    getUserStats(userId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const sessions = this.find('sessions', { userId: userId });
        
        const filteredSessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= start && sessionDate <= end;
        });
        
        const totalTime = this.calculateTotalTime(filteredSessions);
        const avgDailyTime = filteredSessions.length > 0 ? totalTime / this.getDaysBetween(start, end) : 0;
        const completedDays = this.find('workdays', { 
            userId: userId,
            workdayCompleted: true 
        }).filter(workday => {
            const workdayDate = this.parseDate(workday.date);
            return workdayDate >= start && workdayDate <= end;
        }).length;
        
        return {
            totalTime: totalTime,
            averageDailyTime: avgDailyTime,
            completedDays: completedDays,
            totalSessions: filteredSessions.length,
            productivity: totalTime / (3 * 60 * 60 * 1000) // Compared to 3-hour target
        };
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
    
    applyOperators(value, operators) {
        return Object.entries(operators).every(([operator, operatorValue]) => {
            switch (operator) {
                case '$gte': return value >= operatorValue;
                case '$lte': return value <= operatorValue;
                case '$gt': return value > operatorValue;
                case '$lt': return value < operatorValue;
                case '$ne': return value !== operatorValue;
                case '$in': return Array.isArray(operatorValue) && operatorValue.includes(value);
                case '$nin': return Array.isArray(operatorValue) && !operatorValue.includes(value);
                default: return true;
            }
        });
    }
    
    // Export/Import functionality
    exportData() {
        const data = {};
        Object.entries(this.collections).forEach(([name, key]) => {
            data[name] = this.getCollection(name);
        });
        
        return {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: data
        };
    }
    
    importData(exportedData) {
        if (!exportedData.data) throw new Error('Invalid export data format');
        
        Object.entries(exportedData.data).forEach(([collectionName, records]) => {
            if (this.collections[collectionName]) {
                this.saveCollection(collectionName, records);
            }
        });
        
        return true;
    }
    
    // Clear all data (for testing)
    clearAll() {
        Object.values(this.collections).forEach(collection => {
            localStorage.removeItem(collection);
        });
        this.init();
    }
}

// Export for use in other files
window.PontoDevDatabase = PontoDevDatabase;