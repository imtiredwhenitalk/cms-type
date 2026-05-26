<?php
/**
 * Улучшенная система логирования для PHP
 */

class Logger {
    private $logDir = 'logs';
    private $logFile;

    public function __construct($logDir = 'logs') {
        $this->logDir = $logDir;
        $this->ensureLogDir();
    }

    private function ensureLogDir() {
        if (!is_dir($this->logDir)) {
            mkdir($this->logDir, 0755, true);
        }
    }

    private function getTimestamp() {
        return gmdate('c');
    }

    private function formatLog($level, $message, $data = []) {
        return json_encode([
            'timestamp' => $this->getTimestamp(),
            'level' => strtoupper($level),
            'message' => $message,
            'data' => $data,
            'file' => $_SERVER['REQUEST_URI'] ?? 'cli',
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'localhost'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    private function writeLog($filename, $logMessage) {
        $filepath = $this->logDir . '/' . $filename;
        $handle = fopen($filepath, 'a');
        fwrite($handle, $logMessage . "\n");
        fclose($handle);
    }

    public function info($message, $data = []) {
        $log = $this->formatLog('info', $message, $data);
        echo "[INFO] $message\n";
        $this->writeLog('app.log', $log);
    }

    public function warning($message, $data = []) {
        $log = $this->formatLog('warning', $message, $data);
        trigger_error("[WARNING] $message", E_USER_WARNING);
        $this->writeLog('app.log', $log);
    }

    public function error($message, $data = []) {
        $log = $this->formatLog('error', $message, $data);
        trigger_error("[ERROR] $message", E_USER_ERROR);
        $this->writeLog('errors.log', $log);
    }

    public function database($message, $data = []) {
        $log = $this->formatLog('database', $message, $data);
        $this->writeLog('database.log', $log);
    }

    public function auth($message, $data = []) {
        $log = $this->formatLog('auth', $message, $data);
        $this->writeLog('auth.log', $log);
    }

    public function debug($message, $data = []) {
        if (getenv('DEBUG') === 'true' || getenv('DEBUG') === '1') {
            $log = $this->formatLog('debug', $message, $data);
            echo "[DEBUG] $message\n";
            $this->writeLog('debug.log', $log);
        }
    }

    /**
     * Отправляет логи на сервер Flask
     */
    public function sendToServer($level, $message, $data = [], $serverUrl = 'http://localhost:5000') {
        $logData = [
            'level' => $level,
            'message' => $message,
            'data' => $data,
            'source' => 'php',
            'timestamp' => $this->getTimestamp()
        ];

        $ch = curl_init($serverUrl . '/api/logs');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($logData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        
        @curl_exec($ch);
        curl_close($ch);
    }
}

// Создаем глобальный экземпляр
if (!isset($GLOBALS['logger'])) {
    $GLOBALS['logger'] = new Logger('logs');
}

function get_logger() {
    return $GLOBALS['logger'];
}

// Пример использования:
// $logger = get_logger();
// $logger->info('Приложение запущено');
// $logger->auth('Пользователь вошел', ['userId' => 123]);
// $logger->database('Запрос к БД', ['query' => 'SELECT * FROM users']);
// $logger->error('Критическая ошибка', ['code' => 500]);
// $logger->warning('Предупреждение', ['warning_type' => 'deprecated_api']);
// $logger->debug('Отладочная информация', ['debug_data' => ['key' => 'value']]);
?>
