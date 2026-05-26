from flask import Flask, request, jsonify
import logging 
import os 
import sqlalchemy 
import datetime 
import traceback 
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Импортируем логгер
from log.logger import app_logger
from security.registration import RegistrationManager
from data.test_news import get_test_news

app = Flask(__name__)

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
            return jsonify(result), 200
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
    """Создание новой новости"""
    try:
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
        
        new_news = News(title=title, content=content)
        session.add(new_news)
        session.commit()
        
        app_logger.info("Новость создана", news_id=new_news.id, title=title)
        
        response = {
            "message": "Новость создана успешно",
            "news_id": new_news.id,
            "title": new_news.title,
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
    """Обновить новость"""
    try:
        session = Session()
        data = request.get_json()
        
        news_item = session.query(News).filter_by(id=news_id).first()
        
        if not news_item:
            app_logger.warning("Новость не найдена для обновления", news_id=news_id)
            session.close()
            return jsonify({"error": "Новость не найдена"}), 404
        
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
        
        app_logger.info("Новость обновлена", news_id=news_id, title=news_item.title)
        
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
    """Удалить новость"""
    try:
        session = Session()
        news_item = session.query(News).filter_by(id=news_id).first()
        
        if not news_item:
            app_logger.warning("Новость не найдена для удаления", news_id=news_id)
            session.close()
            return jsonify({"error": "Новость не найдена"}), 404
        
        session.delete(news_item)
        session.commit()
        
        app_logger.info("Новость удалена", news_id=news_id, title=news_item.title)
        
        session.close()
        return jsonify({"message": "Новость удалена успешно"}), 200
    
    except Exception as e:
        app_logger.error("Ошибка при удалении новости", error=str(e), news_id=news_id)
        return jsonify({"error": "Ошибка при удалении новости"}), 500


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
        session = Session()
        session.execute("SELECT 1")
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