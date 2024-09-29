from flask import Flask, request, jsonify
from vercel import set_key, get_key



app = Flask(__name__)



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
        return jsonify({"error": str(e)}), 500



@app.route("/api/get_from_kv/<key>", methods=['GET'])
def get_from_kv(key):
    try:
        value = get_key(key)
        if value is None:
            return jsonify({"error": "Key not found"}), 404
        
        return jsonify({"key": key, "value": value}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500