from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/chatbot', methods=['GET'])
def chat():
    return jsonify({
        'response': "Hello, how can I help you today?",
        'status': 'success'
    })