/**
 * Улучшенная система логирования для JavaScript/Node.js
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor(logDir = 'logs') {
        this.logDir = logDir;
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatLog(level, message, data = {}) {
        return JSON.stringify({
            timestamp: this.getTimestamp(),
            level: level.toUpperCase(),
            message: message,
            data: data,
            stack: new Error().stack.split('\n').slice(2, 4).join('\n')
        }, null, 2);
    }

    writeLog(filename, logMessage) {
        const filepath = path.join(this.logDir, filename);
        fs.appendFileSync(filepath, logMessage + '\n');
    }

    info(message, data = {}) {
        const log = this.formatLog('info', message, data);
        console.log(`[INFO] ${message}`);
        this.writeLog('app.log', log);
    }

    warning(message, data = {}) {
        const log = this.formatLog('warning', message, data);
        console.warn(`[WARNING] ${message}`);
        this.writeLog('app.log', log);
    }

    error(message, data = {}) {
        const log = this.formatLog('error', message, data);
        console.error(`[ERROR] ${message}`);
        this.writeLog('errors.log', log);
    }

    database(message, data = {}) {
        const log = this.formatLog('database', message, data);
        this.writeLog('database.log', log);
    }

    auth(message, data = {}) {
        const log = this.formatLog('auth', message, data);
        this.writeLog('auth.log', log);
    }

    debug(message, data = {}) {
        const log = this.formatLog('debug', message, data);
        if (process.env.DEBUG) {
            console.log(`[DEBUG] ${message}`);
            this.writeLog('debug.log', log);
        }
    }
}

// Для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = new Logger();
}

// Пример использования:
// const logger = require('./logger');
// logger.info('Приложение запущено');
// logger.auth('Пользователь вошел', { userId: 123 });
// logger.database('Запрос к БД', { query: 'SELECT * FROM users' });
// logger.error('Критическая ошибка', { code: 500 });
// logger.warning('Предупреждение', { warning_type: 'deprecated_api' });
// logger.debug('Отладочная информация', { debug_data: { key: 'value' } });

// Для браузеров (клиентская сторона):
class BrowserLogger {
    constructor(apiUrl = 'http://localhost:5000') {
        this.apiUrl = apiUrl;
    }

    async sendLog(level, message, data = {}) {
        try {
            const response = await fetch(`${this.apiUrl}/api/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    level: level,
                    message: message,
                    data: data,
                    source: 'browser',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                })
            });
            
            if (!response.ok) {
                console.error('Не удалось отправить лог на сервер');
            }
        } catch (error) {
            console.error('Ошибка при отправке лога:', error);
        }
    }

    async info(message, data = {}) {
        console.log(`[INFO] ${message}`);
        await this.sendLog('info', message, data);
    }

    async warning(message, data = {}) {
        console.warn(`[WARNING] ${message}`);
        await this.sendLog('warning', message, data);
    }

    async error(message, data = {}) {
        console.error(`[ERROR] ${message}`);
        await this.sendLog('error', message, data);
    }

    async auth(message, data = {}) {
        await this.sendLog('auth', message, data);
    }
}

if (typeof window !== 'undefined') {
    window.BrowserLogger = BrowserLogger;
}