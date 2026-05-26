<?php
/**
 * Примеры использования логирования и API в PHP
 */

// Подключаем логгер
require_once 'log/logger.php';
$logger = get_logger();

// ===================== ПРИМЕРЫ ЛОГИРОВАНИЯ =====================

echo "\n=== ПРИМЕРЫ ЛОГИРОВАНИЯ ===\n";

// Информационный лог
$logger->info('Приложение запущено успешно');

// Логи с дополнительными данными
$logger->info('Пользователь совершил действие', [
    'user_id' => 123,
    'action' => 'login',
    'timestamp' => date('c')
]);

// Логи БД
$logger->database('Выполнен запрос SELECT', [
    'query' => 'SELECT * FROM users',
    'rows_affected' => 42,
    'execution_time' => '15ms'
]);

// Логи аутентификации
$logger->auth('Попытка входа', [
    'username' => 'john_doe',
    'success' => true,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
]);

// Предупреждение
$logger->warning('Высокая нагрузка на сервер', [
    'cpu_usage' => 85,
    'memory_usage' => 78,
    'connections' => 450
]);

// Ошибка
$logger->error('Ошибка при подключении к БД', [
    'error_code' => 1045,
    'database' => 'postgresql',
    'host' => 'localhost:5432'
]);

// Отладка
$logger->debug('Отладочная информация', [
    'request_id' => 'abc123',
    'context' => 'user_authentication'
]);


// ===================== ФУНКЦИИ ДЛЯ API CALLS =====================

/**
 * Регистрация пользователя через API
 */
function registerUser($username, $email, $password) {
    global $logger;
    
    $logger->info('Попытка регистрации', [
        'username' => $username,
        'email' => $email
    ]);
    
    $data = [
        'username' => $username,
        'email' => $email,
        'password' => $password,
        'full_name' => 'New User'
    ];
    
    $response = makeApiCall('POST', '/api/auth/register', $data);
    
    if (isset($response['user_id'])) {
        $logger->auth('Пользователь зарегистрирован', [
            'user_id' => $response['user_id']
        ]);
    } else {
        $logger->warning('Ошибка регистрации', [
            'error' => $response['error'] ?? 'Unknown error'
        ]);
    }
    
    return $response;
}

/**
 * Вход пользователя через API
 */
function loginUser($username, $password) {
    global $logger;
    
    $logger->info('Попытка входа', ['username' => $username]);
    
    $data = [
        'username' => $username,
        'password' => $password
    ];
    
    $response = makeApiCall('POST', '/api/auth/login', $data);
    
    if (isset($response['user_id'])) {
        $logger->auth('Пользователь вошел', [
            'user_id' => $response['user_id']
        ]);
    } else {
        $logger->warning('Ошибка входа', [
            'error' => $response['error'] ?? 'Unknown error'
        ]);
    }
    
    return $response;
}

/**
 * Получить все новости через API
 */
function getNews() {
    global $logger;
    
    $logger->info('Получение списка новостей');
    
    $response = makeApiCall('GET', '/api/news', null);
    
    if (isset($response['news'])) {
        $logger->info('Новости получены', [
            'count' => count($response['news'])
        ]);
        return $response['news'];
    } else {
        $logger->error('Ошибка при получении новостей', [
            'error' => $response['error'] ?? 'Unknown error'
        ]);
        return null;
    }
}

/**
 * Получить новость по ID через API
 */
function getNewsById($id) {
    global $logger;
    
    $logger->info('Получение новости', ['news_id' => $id]);
    
    $response = makeApiCall('GET', '/api/news/' . $id, null);
    return $response;
}

/**
 * Создать новость через API
 */
function createNews($title, $content) {
    global $logger;
    
    $logger->info('Создание новости', ['title' => $title]);
    
    $data = [
        'title' => $title,
        'content' => $content
    ];
    
    $response = makeApiCall('POST', '/api/news', $data);
    
    if (isset($response['news_id'])) {
        $logger->info('Новость создана', [
            'news_id' => $response['news_id']
        ]);
    } else {
        $logger->error('Ошибка при создании новости', [
            'error' => $response['error'] ?? 'Unknown error'
        ]);
    }
    
    return $response;
}

/**
 * Обновить новость через API
 */
function updateNews($id, $title, $content) {
    global $logger;
    
    $logger->info('Обновление новости', ['news_id' => $id]);
    
    $data = [];
    if ($title) $data['title'] = $title;
    if ($content) $data['content'] = $content;
    
    $response = makeApiCall('PUT', '/api/news/' . $id, $data);
    return $response;
}

/**
 * Удалить новость через API
 */
function deleteNews($id) {
    global $logger;
    
    $logger->info('Удаление новости', ['news_id' => $id]);
    
    $response = makeApiCall('DELETE', '/api/news/' . $id, null);
    return $response;
}

/**
 * Загрузить тестовые данные через API
 */
function seedTestData($delete_all = false) {
    global $logger;
    
    $logger->info('Загрузка тестовых данных');
    
    $url = '/api/news/seed/test-data';
    if ($delete_all) {
        $url .= '?delete_all=true';
    }
    
    $response = makeApiCall('POST', $url, null);
    
    if (isset($response['count'])) {
        $logger->info('Тестовые данные загружены', [
            'count' => $response['count']
        ]);
    } else {
        $logger->error('Ошибка загрузки', [
            'error' => $response['error'] ?? 'Unknown error'
        ]);
    }
    
    return $response;
}

/**
 * Проверка здоровья приложения
 */
function healthCheck() {
    global $logger;
    
    $response = makeApiCall('GET', '/api/health', null);
    
    if (isset($response['status'])) {
        $logger->info('Health check выполнен', [
            'status' => $response['status']
        ]);
    }
    
    return $response;
}


// ===================== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ =====================

/**
 * Выполняет API запрос на Flask сервер
 */
function makeApiCall($method, $endpoint, $data = null, $base_url = 'http://localhost:5000') {
    global $logger;
    
    $url = $base_url . $endpoint;
    
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($response === false) {
        $error = curl_error($ch);
        $logger->error('Ошибка CURL запроса', [
            'error' => $error,
            'url' => $url
        ]);
        curl_close($ch);
        return ['error' => $error];
    }
    
    curl_close($ch);
    
    $response_data = json_decode($response, true);
    
    $logger->database('API запрос выполнен', [
        'method' => $method,
        'endpoint' => $endpoint,
        'http_code' => $http_code
    ]);
    
    return $response_data ?? ['error' => 'Invalid JSON response'];
}


// ===================== ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ =====================

if (php_sapi_name() === 'cli') {
    echo "\n=== ПРИМЕРЫ ФУНКЦИЙ ===\n\n";
    
    echo "Функции для регистрации и входа:\n";
    echo "  - registerUser(\$username, \$email, \$password)\n";
    echo "  - loginUser(\$username, \$password)\n";
    echo "  - healthCheck()\n\n";
    
    echo "Функции для работы с новостями:\n";
    echo "  - getNews()\n";
    echo "  - getNewsById(\$id)\n";
    echo "  - createNews(\$title, \$content)\n";
    echo "  - updateNews(\$id, \$title, \$content)\n";
    echo "  - deleteNews(\$id)\n";
    echo "  - seedTestData()\n\n";
    
    echo "Примеры:\n";
    echo "  \$result = loginUser('john_doe', 'password123');\n";
    echo "  \$news = getNews();\n";
    echo "  seedTestData();\n\n";
}

?>
