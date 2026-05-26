"""
Пример использования системы регистрации и логирования в Python
"""

from security.registration import RegistrationManager
from log.logger import app_logger
from data.test_news import get_test_news

# ===================== ПРИМЕР ИСПОЛЬЗОВАНИЯ ЛОГИРОВАНИЯ =====================

def example_logging():
    """Примеры использования логгера"""
    
    # Информационный лог
    app_logger.info("Приложение запущено успешно")
    
    # Лог с дополнительными данными
    app_logger.info("Пользователь совершил действие", user_id=123, action="login")
    
    # Логи БД
    app_logger.database("Выполнен запрос", query="SELECT * FROM users", rows=42)
    
    # Логи аутентификации
    app_logger.auth("Попытка входа", username="john_doe", success=True)
    
    # Предупреждение
    app_logger.warning("Высокая нагрузка на сервер", cpu_usage=85)
    
    # Ошибка
    app_logger.error("Ошибка при подключении к БД", error_code=1045)


# ===================== ПРИМЕР ИСПОЛЬЗОВАНИЯ РЕГИСТРАЦИИ =====================

def example_registration():
    """Примеры использования системы регистрации"""
    
    # Создаем менеджер регистрации
    reg_manager = RegistrationManager()
    
    # Регистрация нового пользователя
    print("\n=== Регистрация ===")
    success, result = reg_manager.register_user(
        username="john_doe",
        email="john@example.com",
        password="SecurePass123",
        full_name="John Doe"
    )
    
    if success:
        print(f"✓ Пользователь зарегистрирован: {result}")
    else:
        print(f"✗ Ошибка регистрации: {result}")
    
    # Вход пользователя
    print("\n=== Вход в систему ===")
    success, result = reg_manager.login_user("john_doe", "SecurePass123")
    
    if success:
        print(f"✓ Пользователь вошел: {result}")
        user_id = result['user_id']
    else:
        print(f"✗ Ошибка входа: {result}")
        return
    
    # Получение информации о пользователе
    print("\n=== Информация о пользователе ===")
    success, result = reg_manager.get_user_by_id(user_id)
    
    if success:
        print(f"✓ Информация получена: {result}")
    else:
        print(f"✗ Ошибка: {result}")
    
    # Смена пароля
    print("\n=== Смена пароля ===")
    success, result = reg_manager.change_password(
        user_id=user_id,
        old_password="SecurePass123",
        new_password="NewSecurePass456"
    )
    
    if success:
        print(f"✓ {result}")
    else:
        print(f"✗ Ошибка: {result}")


# ===================== ПРИМЕР РАБОТЫ С ТЕСТОВЫМИ НОВОСТЯМИ =====================

def example_test_news():
    """Примеры работы с тестовыми новостями"""
    
    # Получить все тестовые новости
    all_news = get_test_news()
    print(f"\n=== Все тестовые новости ({len(all_news)} шт) ===")
    for news in all_news[:3]:  # Показываем первые 3
        print(f"- {news['title']}")
        print(f"  {news['content'][:50]}...")
    
    # Получить первые N новостей
    print("\n=== Первые 5 новостей ===")
    first_5 = get_test_news_by_count(5)
    print(f"Получено {len(first_5)} новостей")


# ===================== ИНТЕГРАЦИЯ: API ENDPOINTS =====================

def example_api_usage():
    """
    Примеры использования API endpoints
    
    # Регистрация через API:
    curl -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SecurePass123",
        "full_name": "John Doe"
      }'
    
    # Вход через API:
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "username": "john_doe",
        "password": "SecurePass123"
      }'
    
    # Создание новости:
    curl -X POST http://localhost:5000/api/news \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Новая новость",
        "content": "Содержание новости..."
      }'
    
    # Получить все новости:
    curl http://localhost:5000/api/news
    
    # Получить новость по ID:
    curl http://localhost:5000/api/news/1
    
    # Обновить новость:
    curl -X PUT http://localhost:5000/api/news/1 \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Обновленный заголовок",
        "content": "Обновленное содержание"
      }'
    
    # Удалить новость:
    curl -X DELETE http://localhost:5000/api/news/1
    
    # Загрузить тестовые данные:
    curl -X POST http://localhost:5000/api/news/seed/test-data
    
    # Проверка здоровья приложения:
    curl http://localhost:5000/api/health
    """
    pass


if __name__ == "__main__":
    print("=" * 60)
    print("ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ CMS BACKEND")
    print("=" * 60)
    
    # Примеры логирования
    print("\n### ЛОГИРОВАНИЕ ###")
    example_logging()
    
    # Примеры регистрации
    print("\n### РЕГИСТРАЦИЯ И АУТЕНТИФИКАЦИЯ ###")
    example_registration()
    
    # Примеры работы с новостями
    print("\n### ТЕСТОВЫЕ НОВОСТИ ###")
    example_test_news()
    
    print("\n" + "=" * 60)
    print("Запустите: python -m flask run --port 5000")
    print("=" * 60)
