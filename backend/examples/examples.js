// Примеры использования логирования в JavaScript

const logger = require('./log/logger');

// ===================== ПРИМЕРЫ ЛОГИРОВАНИЯ =====================

console.log("\n=== ПРИМЕРЫ ЛОГИРОВАНИЯ ===\n");

// Информационный лог
logger.info('Приложение запущено успешно');

// Логи с дополнительными данными
logger.info('Пользователь совершил действие', {
    user_id: 123,
    action: 'login',
    timestamp: new Date().toISOString()
});

// Логи БД
logger.database('Выполнен запрос SELECT', {
    query: 'SELECT * FROM users',
    rows_affected: 42,
    execution_time: '15ms'
});

// Логи аутентификации
logger.auth('Попытка входа', {
    username: 'john_doe',
    success: true,
    ip: '192.168.1.1'
});

// Предупреждение
logger.warning('Высокая нагрузка на сервер', {
    cpu_usage: 85,
    memory_usage: 78,
    connections: 450
});

// Ошибка
logger.error('Ошибка при подключении к БД', {
    error_code: 1045,
    database: 'postgresql',
    host: 'localhost:5432'
});

// Отладка (только если DEBUG=true)
logger.debug('Отладочная информация', {
    request_id: 'abc123',
    context: 'user_authentication'
});


// ===================== ПРИМЕРЫ API CALLS =====================

console.log("\n=== ПРИМЕРЫ API CALLS ===\n");

const apiExamples = {
    // Регистрация
    register: {
        method: 'POST',
        url: 'http://localhost:5000/api/auth/register',
        body: {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'SecurePass123',
            full_name: 'John Doe'
        }
    },

    // Вход
    login: {
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
            username: 'john_doe',
            password: 'SecurePass123'
        }
    },

    // Создание новости
    createNews: {
        method: 'POST',
        url: 'http://localhost:5000/api/news',
        body: {
            title: 'Новая новость',
            content: 'Содержание новости...'
        }
    },

    // Получить все новости
    getNews: {
        method: 'GET',
        url: 'http://localhost:5000/api/news'
    },

    // Получить новость по ID
    getNewsById: {
        method: 'GET',
        url: 'http://localhost:5000/api/news/1'
    },

    // Обновить новость
    updateNews: {
        method: 'PUT',
        url: 'http://localhost:5000/api/news/1',
        body: {
            title: 'Обновленный заголовок',
            content: 'Обновленное содержание'
        }
    },

    // Удалить новость
    deleteNews: {
        method: 'DELETE',
        url: 'http://localhost:5000/api/news/1'
    },

    // Загрузить тестовые данные
    seedTestData: {
        method: 'POST',
        url: 'http://localhost:5000/api/news/seed/test-data'
    },

    // Проверка здоровья приложения
    healthCheck: {
        method: 'GET',
        url: 'http://localhost:5000/api/health'
    }
};

console.log('API примеры готовы:');
Object.keys(apiExamples).forEach(key => {
    console.log(`  - ${key}: ${apiExamples[key].method} ${apiExamples[key].url}`);
});


// ===================== ФУНКЦИИ-ПРИМЕРЫ ДЛЯ FETCH =====================

async function registerUser(username, email, password) {
    logger.info('Попытка регистрации', { username, email });
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                full_name: 'New User'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logger.auth('Пользователь зарегистрирован', { user_id: data.user_id });
            return data;
        } else {
            logger.warning('Ошибка регистрации', { error: data.error });
            return null;
        }
    } catch (error) {
        logger.error('Ошибка при регистрации', { error: error.message });
        throw error;
    }
}

async function loginUser(username, password) {
    logger.info('Попытка входа', { username });
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logger.auth('Пользователь вошел', { user_id: data.user_id });
            return data;
        } else {
            logger.warning('Ошибка входа', { error: data.error });
            return null;
        }
    } catch (error) {
        logger.error('Ошибка при входе', { error: error.message });
        throw error;
    }
}

async function getNews() {
    logger.info('Получение списка новостей');
    
    try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();
        
        if (response.ok) {
            logger.info('Новости получены', { count: data.count });
            return data.news;
        } else {
            logger.error('Ошибка при получении новостей', { error: data.error });
            return null;
        }
    } catch (error) {
        logger.error('Ошибка сети', { error: error.message });
        throw error;
    }
}

async function seedTestData() {
    logger.info('Загрузка тестовых данных');
    
    try {
        const response = await fetch('http://localhost:5000/api/news/seed/test-data', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logger.info('Тестовые данные загружены', { count: data.count });
            return data;
        } else {
            logger.error('Ошибка загрузки', { error: data.error });
            return null;
        }
    } catch (error) {
        logger.error('Ошибка при загрузке', { error: error.message });
        throw error;
    }
}

console.log("\nФункции-примеры готовы к использованию:");
console.log("  - registerUser(username, email, password)");
console.log("  - loginUser(username, password)");
console.log("  - getNews()");
console.log("  - seedTestData()");
