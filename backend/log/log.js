function sendLog(level, message, details = {}) {
    fetch('http://localhost:5000/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source: 'javascript',
            level: level,
            message: message,
            details: details
        })
    }).catch(err => console.error('Не удалось отправить лог:', err));
}

sendLog('warn', 'Пользователь ввел неверный пароль', { userId: 42 });
sendLog('error', 'Сервер не отвечает', { endpoint: '/api/data' }); 