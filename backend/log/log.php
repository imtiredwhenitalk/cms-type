<?php
function send_log_to_python($level, $message, $details = []) {
    $url = 'http://localhost:5000/log';
    $data = [
        'source' => 'php',
        'level' => $level,
        'message' => $message,
        'details' => $details
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
}

send_log_to_python('error', 'Ошибка подключения к БД', ['code' => 1045]);
?>
