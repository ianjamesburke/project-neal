from flask import Flask, request, jsonify
from openai import OpenAI
import os
import json
from pydantic import BaseModel

app = Flask(__name__)

FLASK_ENV = os.getenv('FLASK_ENV')

@app.route('/api/chatbot', methods=['POST'])
def chat(data=None):
    if data is None:    
        data = request.json
    chat_log = data.get('chat_log', [])
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    with open('prompts/chat_bot_prompt.txt', 'r') as file:
        prompt = file.read()

    messages = [{"role": "system", "content": prompt}]
    for message in chat_log:
        messages.append(message)

    

    class Response(BaseModel):
        response: str
        script_ready: bool
        ask_for_uploads: bool


    print("ABOUT TO CALL GPT:", messages)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        response_format=Response,
    )

    data = completion.choices[0].message.parsed


    return jsonify({"response": data.response, "script_ready": data.script_ready, "ask_for_uploads": data.ask_for_uploads}), 200