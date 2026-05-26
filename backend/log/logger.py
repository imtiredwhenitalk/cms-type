import logging
import json
import os
from datetime import datetime
from pathlib import Path

class JSONFormatter(logging.Formatter):
    """Форматирует логи в JSON"""
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data, ensure_ascii=False)


def setup_logger(name, log_file="logs/app.log", level=logging.INFO):
    """Настраивает логгер с JSON форматом"""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Создаем директорию логов если её нет
    log_dir = os.path.dirname(log_file)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # File handler с JSON форматом
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(level)
    file_handler.setFormatter(JSONFormatter())
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    console_formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger


class AppLogger:
    """Главный логгер приложения"""
    def __init__(self):
        self.logger = setup_logger("cms_app", "logs/app.log")
        self.db_logger = setup_logger("database", "logs/database.log")
        self.auth_logger = setup_logger("auth", "logs/auth.log")
        self.error_logger = setup_logger("errors", "logs/errors.log")
    
    def info(self, message, **kwargs):
        """Информационный лог"""
        self.logger.info(f"{message} | {json.dumps(kwargs, ensure_ascii=False)}")
    
    def warning(self, message, **kwargs):
        """Предупреждение"""
        self.logger.warning(f"{message} | {json.dumps(kwargs, ensure_ascii=False)}")
    
    def error(self, message, **kwargs):
        """Ошибка"""
        self.error_logger.error(f"{message} | {json.dumps(kwargs, ensure_ascii=False)}")
    
    def database(self, message, **kwargs):
        """Логи базы данных"""
        self.db_logger.info(f"{message} | {json.dumps(kwargs, ensure_ascii=False)}")
    
    def auth(self, message, **kwargs):
        """Логи аутентификации"""
        self.auth_logger.info(f"{message} | {json.dumps(kwargs, ensure_ascii=False)}")


# Глобальный экземпляр логгера
app_logger = AppLogger()
