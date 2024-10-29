from flask import Flask, request, jsonify
from openai import OpenAI
import os
import json

app = Flask(__name__)

@app.route('/api/chatbot', methods=['POST'])
def chat(data=None):
    if data is None:    
        data = request.json
    thread_id = data.get('thread_id', None)
    chat_log = data.get('chat_log', [])

    return jsonify({"response": "Ian broke everything please hold..."}), 200