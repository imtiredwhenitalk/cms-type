import flask 
import datetime
import os 
import json 
import uuid
import logging 
import sys 
import traceback
import time 
import requests

app = flask.Flask(__name__)

MK_DIRS = ["logs"]
for d in MK_DIRS:
    if not os.path.exists(d):
        os.makedirs(d)

LOG_FILE = "logs/shared_apps.log"
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)

@app.route('/log', methods=['POST'])
def receive_log():
    data = requests.request.get_json() or {}
    
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "source": data.get("source", "unknown"), 
        "level": data.get("level", "info").upper(),
        "message": data.get("message", ""),
        "details": data.get("details", {})
    }
    
    import json
    logging.info(json.dumps(log_entry, ensure_ascii=False))
    
    return flask.jsonify({"status": "success"}), 200

@app.route('/log-message', methods=['POST'])
def log_message_endpoint():
    data = flask.request.get_json() or {}
    
    source = data.get("source", "unknown")
    level = data.get("level", "info")
    message = data.get("message", "")
    details = data.get("details", {})
    
    log_message(source, level, message, details)
    
    return flask.jsonify({"status": "logged"}), 200

def log_message(source, level, message, details=None):
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "source": source,
        "level": level.upper(),
        "message": message,
        "details": details or {}
    }
    
    import json
    logging.info(json.dumps(log_entry, ensure_ascii=False))

if __name__ == '__main__':
    app.run(port=5000)