from flask import Flask, request, jsonify
import logging 
import os 
import sqlalchemy 
import datetime 
import traceback 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import relationship, Column, Integer, String, DateTime, Text, JSON

app = Flask(__name__)

@app.route("/create_news", methods=["POST"])
def create_news():
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    if len(title) > 35:
        return jsonify({"error": "Title must be 35 characters or less"}), 400
    if len(content) > 3500:
        return jsonify({"error": "Content must be 3500 characters or less"}), 400
    database_url = os.getenv("DATABASE_URL", "localhost:5432/mydb")
    engine = create_engine(database_url)
    Base = declarative_base()
    class News(Base):
        __tablename__ = "news"
        id = Column(Integer, primary_key=True)
        title = Column(String(35), nullable=False)
        content = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    new_news = News(title=title, content=content)
    session.add(new_news)
    session.commit()
    return jsonify({"message": "News created successfully", "news_id": new_news.id}), 201
   
@app.route("/get_news", methods=["GET"])
def get_news():
    database_url = os.getenv("DATABASE_URL", "localhost:5432/mydb")
    engine = create_engine(database_url)
    Base = declarative_base()
    class News(Base):
        __tablename__ = "news"
        id = Column(Integer, primary_key=True)
        title = Column(String(35), nullalble=False)
        content = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    news = session.query(News).order_by(News.created_at.desc()).all()
    news_list = []
    for item in news:
        news_list.append({
            "id": item.id,
            "title": item.title,
            "content": item.content,
            "created_at": item.created_at.isoformat()
        })
    return jsonify({"news": news_list}), 200

@app.route("/open_news", methods=["GET"])
def open_news():
    news_id = request.args.get("id")
    if not news_id:
        return jsonify({"error": "News ID is required"}), 400
    database_url = os.getenv("DATABASE_URL", "localhost:5432/mydb")
    engine = create_engine(database_url)
    Base = declarative_base()
    class News(Base):
        __tablename__ = "news"
        id = Column(Integer, primary_key=True)
        title = Column(String(35), nullable=False)
        content = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    news_item = session.query(News).filter_by(id=news_id).first()
    if not news_item:
        return jsonify({"error": "News item not found"}), 404
    return jsonify({
        "id": news_item.id,
        "title": news_item.title,
        "content": news_item.content,
            "created_at": news_item.created_at.isoformat()
        }), 200 

@app.route("/delete_news", methods=["DELETE"])
def delete_news():
    news_id = request.args.get("id")
    if not_news_id:
        return jsonify({"error": "News ID is required"}), 400
    database_url = os.getenv("DATABASE_URL", "localhost:5432/mydb")
    engine = create_engine(database_url)
    Base = declarative_base()
    class News(Base):
        __tablename__ = "news"
        id = Column(Integer, primary_key=True)
        title = Column(String(35), nullable=False)
        content = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    news_item = session.query(News). filter_by(id=news_id).first()
    if not news_item:
        return jsonify({"error": "News item not found"}), 404
    session.delete(news_item)
    session.commit()
    return jsonify({"message": "News item deleted successfully"}), 200  

@app.route("/update_news", methods=["GET"])
def update_news():
    news_id = request.args.get("id")
    title = request.args.get("title")
    content = request.args.get("content")
    if not_news_id:
        return jsonify({"error": "News ID is required"}), 400
    if title and len(title) > 35:
        return jsonify({"error": "Title must be 35 characters or less"}), 400
    if content and len(content) > 3500:
        return jsonify({"error": "Content must be 3500 characters or less"}), 400
    database_url = os.getenv("DATABASE_URL", "localhost:5432/mydb")
    engine = create_engine(database_url)
    Base = declarative_base()
    class News(Base):
        __tablename__ = "news"
        id = Column(Integer, primary_key=True)
        title = Column(String(35), nullable=False)
        content = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
        Base.metadata.create_all(engine)
        Session = sessionmaker(bind=engine)
        session = Session()
        news_item = session.query(News).filter_by(id=news_id).first()
        if not news_item:
            return jsonify({"error": "News item not found"}), 404
        if title:
            news_item.title = title
            if content:
                news_item.content = content
                session.commit()
                return jsonify({"message": "News item updated successfully"}), 200

@app.route("/news", methods=["GET", "POST", "DELETE", "PUT"])
def news():
    if request.method == "POST":
        return create_news()
    elif request.method == "GET":
        return get_news()
    elif request.method == "DELETE":
        return delete_news()
    elif request.method == "PUT":
        return update_news()
    else:
        return jsonify({"error": "Method not allowed"}), 405



app = Flask(__name__)
app.run(port=5000)