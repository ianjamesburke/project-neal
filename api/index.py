import logging
from flask import Flask, request, jsonify
from api.kv_handler import set_key, get_key
from api.message_assistant import message_assistant
from api.build_payload import build_payload
import json

# Initialize Flask app
app = Flask(__name__)
app.debug = True

# Configure logging
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')

@app.route("/api/python")
def hello_world():
    some_shit = "API link is working"
    return some_shit

@app.route("/api/add_to_kv", methods=['POST'])
def add_to_kv():
    data = request.json
    key = data.get('key')
    value = data.get('value')

    if not key or not value:
        return jsonify({"error": "Both key and value are required"}), 400
    try:
        result = set_key(key, value)
        return jsonify({"message": "Key-value pair added successfully", "result": result})
    except Exception as e:
        logging.error(f"Error adding key-value pair: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_from_kv/<key>", methods=['GET'])
def get_from_kv(key):
    try:
        value = get_key(key)
        if value is None:
            return jsonify({"error": "Key not found"}), 404
        
        return jsonify({"key": key, "value": value}), 200
    except Exception as e:
        logging.error(f"Error retrieving key: {e}")
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/message-assistant", methods=['POST'])
def message_assistant_route():
    try:
        # get data
        data = request.json

        # destructure data
        chat_log = data.get('chat_log')
        thread_id = data.get('thread_id')

        # call function
        response, script_ready, ask_for_uploads, thread_id = message_assistant(chat_log, thread_id)

        # return result
        return jsonify({ "response": response, "script_ready": script_ready, "ask_for_uploads": ask_for_uploads, "thread_id": thread_id })
    
    except Exception as e:
        logging.error(f"Error in message_assistant_route: {e}")
        return jsonify({"error": str(e)}), 500
    


@app.route('/api/build-payload', methods=['POST'])
def build_payload_route():
    try:
        # get data
        data = request.json

        # destructure data
        chat_log = data.get('chat_log', [])

        # call function
        payload = build_payload(chat_log)

        payload_key = "temp_payload_key"

        # Send to Vercel KV
        set_key(payload_key, payload)

        # placeholder_payload_key = "this is a test"

        return jsonify({"payload_key": payload_key}), 202



    except Exception as e:
        logging.error(f"An error occurred in build_payload_route: {e}")
        return jsonify({"error": "An error occurred while starting the video rendering."}), 500
