from flask import Flask, request, jsonify
from flask_cors import CORS
import logging 
import os 
import sqlalchemy 
import datetime 
import traceback 
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Импортируем логгер
from log.logger import app_logger
from security.registration import RegistrationManager, User
from security.security import generate_token, verify_token
from data.test_news import get_test_news

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Конфигурация БД
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///cms.db")
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Модель News
class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    author_name = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

# Инициализируем менеджер регистрации
reg_manager = RegistrationManager(DATABASE_URL)



# ==================== ENDPOINTS РЕГИСТРАЦИИ ====================

@app.route("/api/auth/register", methods=["POST"])
def register():
    """Регистрация нового пользователя"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Пустой запрос"}), 400
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")
        
        if not username or not email or not password:
            return jsonify({"error": "username, email и password обязательны"}), 400
        
        success, result = reg_manager.register_user(username, email, password, full_name)
        
        if success:
            return jsonify(result), 201
        else:
            return jsonify({"error": result}), 400
    
    except Exception as e:
        app_logger.error("Ошибка при регистрации", error=str(e))
        return jsonify({"error": "Ошибка при регистрации"}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """Вход пользователя"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Пустой запрос"}), 400
        
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "username и password обязательны"}), 400
        
        success, result = reg_manager.login_user(username, password)
        
        if success:
            token = generate_token(result['user_id'])
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user_id': result['user_id'],
                'username': result['username'],
                'is_admin': result.get('is_admin', False)
            }), 200
        else:
            return jsonify({"error": result}), 401
    
    except Exception as e:
        app_logger.error("Ошибка при входе", error=str(e))
        return jsonify({"error": "Ошибка при входе"}), 500


@app.route("/api/auth/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Получить информацию о пользователе"""
    try:
        success, result = reg_manager.get_user_by_id(user_id)
        
        if success:
            return jsonify(result), 200
        else:
            return jsonify({"error": result}), 404
    
    except Exception as e:
        app_logger.error("Ошибка при получении пользователя", error=str(e))
        return jsonify({"error": "Ошибка при получении пользователя"}), 500


@app.route("/api/auth/change-password", methods=["POST"])
def change_password():
    """Смена пароля"""
    try:
        data = request.get_json()
        
        user_id = data.get("user_id")
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        
        if not user_id or not old_password or not new_password:
            return jsonify({"error": "user_id, old_password и new_password обязательны"}), 400
        
        success, result = reg_manager.change_password(user_id, old_password, new_password)
        
        if success:
            return jsonify({"message": result}), 200
        else:
            return jsonify({"error": result}), 400
    
    except Exception as e:
        app_logger.error("Ошибка при смене пароля", error=str(e))
        return jsonify({"error": "Ошибка при смене пароля"}), 500


# ==================== ENDPOINTS НОВОСТЕЙ ====================

@app.route("/api/news", methods=["POST"])
def create_news():
    """Создание новой новости (только для авторизованных пользователей)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        data = request.get_json()
        
        title = data.get("title")
        content = data.get("content")
        
        if not title or not content:
            return jsonify({"error": "Title и content обязательны"}), 400
        
        if len(title) > 255:
            return jsonify({"error": "Title не должен быть больше 255 символов"}), 400
        
        if len(content) > 10000:
            return jsonify({"error": "Content не должен быть больше 10000 символов"}), 400
        
        # Получаем информацию о пользователе
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            session.close()
            return jsonify({"error": "Пользователь не найден"}), 404
        
        new_news = News(
            title=title, 
            content=content,
            user_id=user_id,
            author_name=user.full_name or user.username
        )
        session.add(new_news)
        session.commit()
        
        app_logger.info("Новость создана", news_id=new_news.id, title=title, user_id=user_id)
        
        response = {
            "message": "Новость создана успешно",
            "news_id": new_news.id,
            "title": new_news.title,
            "author_name": new_news.author_name,
            "created_at": new_news.created_at.isoformat()
        }
        
        session.close()
        return jsonify(response), 201
    
    except Exception as e:
        app_logger.error("Ошибка при создании новости", error=str(e))
        return jsonify({"error": "Ошибка при создании новости"}), 500


@app.route("/api/news", methods=["GET"])
def get_news():
    """Получить все новости"""
    try:
        session = Session()
        news = session.query(News).order_by(News.created_at.desc()).all()
        
        news_list = []
        for item in news:
            news_list.append({
                "id": item.id,
                "title": item.title,
                "content": item.content,
                "user_id": item.user_id,
                "author_name": item.author_name,
                "created_at": item.created_at.isoformat(),
                "updated_at": item.updated_at.isoformat()
            })
        
        app_logger.info("Получен список новостей", count=len(news_list))
        session.close()
        
        return jsonify({"news": news_list, "count": len(news_list)}), 200
    
    except Exception as e:
        app_logger.error("Ошибка при получении новостей", error=str(e))
        return jsonify({"error": "Ошибка при получении новостей"}), 500


@app.route("/api/news/<int:news_id>", methods=["GET"])
def get_news_by_id(news_id):
    """Получить новость по ID"""
    try:
        session = Session()
        news_item = session.query(News).filter_by(id=news_id).first()
        
        if not news_item:
            app_logger.warning("Новость не найдена", news_id=news_id)
            session.close()
            return jsonify({"error": "Новость не найдена"}), 404
        
        response = {
            "id": news_item.id,
            "title": news_item.title,
            "content": news_item.content,
            "user_id": news_item.user_id,
            "author_name": news_item.author_name,
            "created_at": news_item.created_at.isoformat(),
            "updated_at": news_item.updated_at.isoformat()
        }
        
        session.close()
        return jsonify(response), 200
    
    except Exception as e:
        app_logger.error("Ошибка при получении новости", error=str(e), news_id=news_id)
        return jsonify({"error": "Ошибка при получении новости"}), 500


@app.route("/api/news/<int:news_id>", methods=["PUT"])
def update_news(news_id):
    """Обновить новость (только автор или админ)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        data = request.get_json()
        
        news_item = session.query(News).filter_by(id=news_id).first()
        
        if not news_item:
            app_logger.warning("Новость не найдена для обновления", news_id=news_id)
            session.close()
            return jsonify({"error": "Новость не найдена"}), 404
        
        # Проверяем права доступа
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            session.close()
            return jsonify({"error": "Пользователь не найден"}), 404
        
        # Только автор или админ может редактировать
        if news_item.user_id != user_id and not user.is_admin:
            session.close()
            return jsonify({"error": "У вас нет прав для редактирования этой новости"}), 403
        
        if "title" in data:
            if len(data["title"]) > 255:
                return jsonify({"error": "Title не должен быть больше 255 символов"}), 400
            news_item.title = data["title"]
        
        if "content" in data:
            if len(data["content"]) > 10000:
                return jsonify({"error": "Content не должен быть больше 10000 символов"}), 400
            news_item.content = data["content"]
        
        news_item.updated_at = datetime.datetime.utcnow()
        session.commit()
        
        app_logger.info("Новость обновлена", news_id=news_id, title=news_item.title, user_id=user_id)
        
        response = {
            "message": "Новость обновлена успешно",
            "id": news_item.id,
            "title": news_item.title,
            "updated_at": news_item.updated_at.isoformat()
        }
        
        session.close()
        return jsonify(response), 200
    
    except Exception as e:
        app_logger.error("Ошибка при обновлении новости", error=str(e), news_id=news_id)
        return jsonify({"error": "Ошибка при обновлении новости"}), 500


@app.route("/api/news/<int:news_id>", methods=["DELETE"])
def delete_news(news_id):
    """Удалить новость (только автор или админ)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        news_item = session.query(News).filter_by(id=news_id).first()
        
        if not news_item:
            app_logger.warning("Новость не найдена для удаления", news_id=news_id)
            session.close()
            return jsonify({"error": "Новость не найдена"}), 404
        
        # Проверяем права доступа
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            session.close()
            return jsonify({"error": "Пользователь не найден"}), 404
        
        # Только автор или админ может удалять
        if news_item.user_id != user_id and not user.is_admin:
            session.close()
            return jsonify({"error": "У вас нет прав для удаления этой новости"}), 403
        
        session.delete(news_item)
        session.commit()
        
        app_logger.info("Новость удалена", news_id=news_id, title=news_item.title, user_id=user_id)
        
        session.close()
        return jsonify({"message": "Новость удалена успешно"}), 200
    
    except Exception as e:
        app_logger.error("Ошибка при удалении новости", error=str(e), news_id=news_id)
        return jsonify({"error": "Ошибка при удалении новости"}), 500


# ==================== ADMIN ENDPOINTS ====================

@app.route("/api/admin/users", methods=["GET"])
def get_all_users():
    """Получить список всех пользователей (только для админов)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        user = session.query(User).filter_by(id=user_id).first()
        
        if not user or not user.is_admin:
            session.close()
            return jsonify({"error": "Доступ запрещен. Требуются права админа"}), 403
        
        users = session.query(User).all()
        
        users_list = []
        for u in users:
            users_list.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "full_name": u.full_name,
                "is_active": u.is_active,
                "is_admin": u.is_admin,
                "created_at": u.created_at.isoformat()
            })
        
        app_logger.info("Получен список пользователей", count=len(users_list), admin_id=user_id)
        session.close()
        
        return jsonify({"users": users_list, "count": len(users_list)}), 200
    
    except Exception as e:
        app_logger.error("Ошибка при получении списка пользователей", error=str(e))
        return jsonify({"error": "Ошибка при получении списка пользователей"}), 500


@app.route("/api/admin/users/<int:target_user_id>", methods=["PUT"])
def update_user(target_user_id):
    """Обновить пользователя (только для админов)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        admin = session.query(User).filter_by(id=user_id).first()
        
        if not admin or not admin.is_admin:
            session.close()
            return jsonify({"error": "Доступ запрещен. Требуются права админа"}), 403
        
        target_user = session.query(User).filter_by(id=target_user_id).first()
        if not target_user:
            session.close()
            return jsonify({"error": "Пользователь не найден"}), 404
        
        data = request.get_json()
        
        if "is_active" in data:
            target_user.is_active = data["is_active"]
        if "is_admin" in data:
            target_user.is_admin = data["is_admin"]
        
        session.commit()
        
        app_logger.info("Пользователь обновлен админом", target_user_id=target_user_id, admin_id=user_id)
        
        response = {
            "message": "Пользователь обновлен успешно",
            "id": target_user.id,
            "username": target_user.username,
            "is_active": target_user.is_active,
            "is_admin": target_user.is_admin
        }
        
        session.close()
        return jsonify(response), 200
    
    except Exception as e:
        app_logger.error("Ошибка при обновлении пользователя", error=str(e), user_id=target_user_id)
        return jsonify({"error": "Ошибка при обновлении пользователя"}), 500


@app.route("/api/admin/users/<int:target_user_id>", methods=["DELETE"])
def delete_user(target_user_id):
    """Удалить пользователя (только для админов)"""
    try:
        # Проверяем токен
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Неверный или истекший токен"}), 401
        
        session = Session()
        admin = session.query(User).filter_by(id=user_id).first()
        
        if not admin or not admin.is_admin:
            session.close()
            return jsonify({"error": "Доступ запрещен. Требуются права админа"}), 403
        
        target_user = session.query(User).filter_by(id=target_user_id).first()
        if not target_user:
            session.close()
            return jsonify({"error": "Пользователь не найден"}), 404
        
        session.delete(target_user)
        session.commit()
        
        app_logger.info("Пользователь удален админом", target_user_id=target_user_id, admin_id=user_id)
        
        session.close()
        return jsonify({"message": "Пользователь удален успешно"}), 200
    
    except Exception as e:
        app_logger.error("Ошибка при удалении пользователя", error=str(e), user_id=target_user_id)
        return jsonify({"error": "Ошибка при удалении пользователя"}), 500


# ==================== ENDPOINTS ТЕСТОВЫХ ДАННЫХ ====================

@app.route("/api/news/seed/test-data", methods=["POST"])
def seed_test_data():
    """Загрузить тестовые новости в БД"""
    try:
        session = Session()
        test_news = get_test_news()
        
        # Очищаем старые данные если нужно
        delete_all = request.args.get("delete_all", False)
        if delete_all == "true":
            session.query(News).delete()
            session.commit()
            app_logger.info("Старые новости удалены")
        
        count = 0
        for news_data in test_news:
            # Проверяем не существует ли уже такая новость
            existing = session.query(News).filter_by(title=news_data["title"]).first()
            if not existing:
                new_news = News(
                    title=news_data["title"],
                    content=news_data["content"]
                )
                session.add(new_news)
                count += 1
        
        session.commit()
        app_logger.info("Тестовые новости загружены", count=count)
        
        session.close()
        return jsonify({
            "message": f"Загружено {count} тестовых новостей",
            "count": count
        }), 201
    
    except Exception as e:
        app_logger.error("Ошибка при загрузке тестовых данных", error=str(e))
        return jsonify({"error": "Ошибка при загрузке тестовых данных"}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """Проверка здоровья приложения"""
    try:
        from sqlalchemy import text
        session = Session()
        session.execute(text("SELECT 1"))
        session.close()
        
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "version": "1.0.0"
        }), 200
    
    except Exception as e:
        app_logger.error("Ошибка при проверке здоровья", error=str(e))
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


# ==================== LEGACY ENDPOINTS (для совместимости) ====================

@app.route("/create_news", methods=["POST"])
def create_news_legacy():
    return create_news()

@app.route("/get_news", methods=["GET"])
def get_news_legacy():
    return get_news()

@app.route("/open_news", methods=["GET"])
def open_news_legacy():
    """Получить новость (legacy версия)"""
    news_id = request.args.get("id")
    if not news_id:
        return jsonify({"error": "News ID is required"}), 400
    return get_news_by_id(int(news_id))

@app.route("/delete_news", methods=["DELETE"])
def delete_news_legacy():
    """Удалить новость (legacy версия)"""
    news_id = request.args.get("id")
    if not news_id:
        return jsonify({"error": "News ID is required"}), 400
    return delete_news(int(news_id))

@app.route("/update_news", methods=["POST", "PUT", "GET"])
def update_news_legacy():
    """Обновить новость (legacy версия)"""
    news_id = request.args.get("id")
    title = request.args.get("title")
    content = request.args.get("content")
    
    if not news_id:
        return jsonify({"error": "News ID is required"}), 400
    
    data = {}
    if title:
        data["title"] = title
    if content:
        data["content"] = content
    
    # Временно устанавливаем JSON для update_news
    request.json = data
    return update_news(int(news_id))

@app.route("/news", methods=["GET", "POST", "DELETE", "PUT"])
def news():
    """Универсальный endpoint для новостей"""
    if request.method == "POST":
        return create_news()
    elif request.method == "GET":
        return get_news()
    elif request.method == "DELETE":
        news_id = request.args.get("id")
        if news_id:
            return delete_news(int(news_id))
        return jsonify({"error": "News ID is required"}), 400
    elif request.method == "PUT":
        news_id = request.args.get("id")
        if news_id:
            return update_news(int(news_id))
        return jsonify({"error": "News ID is required"}), 400
    else:
        return jsonify({"error": "Method not allowed"}), 405


# ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================

@app.before_request
def log_request():
    """Логирование каждого запроса"""
    app_logger.info(f"Запрос: {request.method} {request.path}", 
                   ip=request.remote_addr,
                   user_agent=request.user_agent.string if request.user_agent else "Unknown")

@app.errorhandler(404)
def not_found(error):
    """Обработчик 404"""
    app_logger.warning("Страница не найдена", path=request.path)
    return jsonify({"error": "Страница не найдена"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Обработчик 500"""
    app_logger.error("Внутренняя ошибка сервера", error=str(error))
    return jsonify({"error": "Внутренняя ошибка сервера"}), 500


if __name__ == "__main__":
    app_logger.info("Запуск Flask приложения на порту 5000")
    app.run(port=5000, debug=True)