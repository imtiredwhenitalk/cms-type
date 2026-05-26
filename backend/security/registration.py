import hashlib
import secrets
import re
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from log.logger import app_logger

Base = declarative_base()

class User(Base):
    """Модель пользователя для регистрации"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RegistrationManager:
    """Менеджер регистрации пользователей"""
    
    def __init__(self, database_url=None):
        self.database_url = database_url or os.getenv(
            "DATABASE_URL", 
            "postgresql://user:password@localhost:5432/cms_db"
        )
        self.engine = create_engine(self.database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    @staticmethod
    def hash_password(password):
        """Хеширует пароль с солью"""
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}${pwd_hash.hex()}"
    
    @staticmethod
    def verify_password(password, password_hash):
        """Проверяет пароль"""
        try:
            salt, stored_hash = password_hash.split('$')
            pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return pwd_hash.hex() == stored_hash
        except Exception as e:
            app_logger.error("Ошибка при проверке пароля", error=str(e))
            return False
    
    @staticmethod
    def validate_email(email):
        """Валидирует email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_username(username):
        """Валидирует имя пользователя"""
        if len(username) < 3 or len(username) > 50:
            return False
        pattern = r'^[a-zA-Z0-9_-]+$'
        return re.match(pattern, username) is not None
    
    @staticmethod
    def validate_password(password):
        """Валидирует пароль"""
        if len(password) < 8:
            return False, "Пароль должен быть минимум 8 символов"
        if not any(c.isupper() for c in password):
            return False, "Пароль должен содержать хотя бы одну заглавную букву"
        if not any(c.isdigit() for c in password):
            return False, "Пароль должен содержать хотя бы одну цифру"
        return True, "OK"
    
    def register_user(self, username, email, password, full_name=None):
        """Регистрирует нового пользователя"""
        session = self.Session()
        
        try:
            # Валидация
            if not self.validate_username(username):
                app_logger.warning("Неверное имя пользователя", username=username)
                return False, "Имя пользователя может содержать только буквы, цифры, _ и -"
            
            if not self.validate_email(email):
                app_logger.warning("Неверный email", email=email)
                return False, "Неверный формат email"
            
            valid, msg = self.validate_password(password)
            if not valid:
                app_logger.warning("Слабый пароль", email=email)
                return False, msg
            
            # Проверка существования
            existing_user = session.query(User).filter(
                (User.username == username) | (User.email == email)
            ).first()
            
            if existing_user:
                app_logger.warning("Попытка регистрации с существующим username/email", 
                                 username=username, email=email)
                return False, "Пользователь с таким username или email уже существует"
            
            # Создание пользователя
            password_hash = self.hash_password(password)
            user = User(
                username=username,
                email=email,
                password_hash=password_hash,
                full_name=full_name,
                is_active=True
            )
            
            session.add(user)
            session.commit()
            
            app_logger.auth("Новый пользователь зарегистрирован", 
                          user_id=user.id, username=username, email=email)
            
            return True, {"user_id": user.id, "username": username, "email": email}
        
        except Exception as e:
            session.rollback()
            app_logger.error("Ошибка при регистрации", error=str(e), username=username)
            return False, f"Ошибка при регистрации: {str(e)}"
        finally:
            session.close()
    
    def login_user(self, username, password):
        """Проверяет учетные данные для входа"""
        session = self.Session()
        
        try:
            user = session.query(User).filter_by(username=username).first()
            
            if not user:
                app_logger.warning("Попытка входа с несуществующим username", username=username)
                return False, "Неверное имя пользователя или пароль"
            
            if not user.is_active:
                app_logger.warning("Попытка входа неактивным пользователем", user_id=user.id)
                return False, "Аккаунт деактивирован"
            
            if not self.verify_password(password, user.password_hash):
                app_logger.warning("Неверный пароль при входе", user_id=user.id, username=username)
                return False, "Неверное имя пользователя или пароль"
            
            app_logger.auth("Пользователь вошел в систему", user_id=user.id, username=username)
            
            return True, {
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_admin
            }
        
        except Exception as e:
            app_logger.error("Ошибка при входе", error=str(e), username=username)
            return False, f"Ошибка при входе: {str(e)}"
        finally:
            session.close()
    
    def get_user_by_id(self, user_id):
        """Получает пользователя по ID"""
        session = self.Session()
        
        try:
            user = session.query(User).filter_by(id=user_id).first()
            if user:
                return True, {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "is_active": user.is_active,
                    "created_at": user.created_at.isoformat()
                }
            return False, "Пользователь не найден"
        except Exception as e:
            app_logger.error("Ошибка при получении пользователя", error=str(e))
            return False, str(e)
        finally:
            session.close()
    
    def change_password(self, user_id, old_password, new_password):
        """Меняет пароль пользователя"""
        session = self.Session()
        
        try:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                return False, "Пользователь не найден"
            
            if not self.verify_password(old_password, user.password_hash):
                app_logger.warning("Неверный старый пароль при смене", user_id=user_id)
                return False, "Неверный текущий пароль"
            
            valid, msg = self.validate_password(new_password)
            if not valid:
                return False, msg
            
            user.password_hash = self.hash_password(new_password)
            session.commit()
            
            app_logger.auth("Пароль изменен", user_id=user_id, username=user.username)
            return True, "Пароль успешно изменен"
        
        except Exception as e:
            session.rollback()
            app_logger.error("Ошибка при смене пароля", error=str(e), user_id=user_id)
            return False, str(e)
        finally:
            session.close()
