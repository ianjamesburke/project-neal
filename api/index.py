from flask import Flask
app = Flask(__name__)



@app.route("/api/python")
def hello_world():

    import requests
    url = "https://utfs.io/f/mWiSbu5B60JISbnWtmTbIuWJV8nyPDQFXv0YmcE4dfi9HLTS"
    r = requests.get(url, allow_redirects=True)
    open('tmp/input.wav', 'wb').write(r.content)

    with open('tmp/input.wav', 'rb') as f:
        data = f.read()
    
    return "<p>file read/write seems to have worked</p>"


