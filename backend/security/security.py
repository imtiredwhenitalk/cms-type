import jwt 
from datetime import datetime, timedelta
from flask import request, jsonify
import os
import logging 
from jwt import ExpiredSignatureError, InvalidTokenError

SECRET_KEY = os.getenv("SECRET_KEY", "DCJNJVFKJDVNFJDNVJKGNJDNGJNBD")

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256") 

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algotithms=["HS256"])
        return payload["user_id"]
    except ExpiredSignatureError:
        logging.warning("Token expired")
        return None
    except InvalidTokenError:
        logging.warning("Invalid token")
        return None

def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401
        return f(user_id, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

def session_required(f):
    def decorated(*args, **kwargs):
        session_token = request.cookies.get("session_token")
        if not session_token:
            return jsonify({"error": "Session token is missing"}), 401
        user_id = verify_token(session_token)
        if not user_id:
            return jsonify({"error": "Invalid or expired session token"}), 401
        return f(user_id, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated 

