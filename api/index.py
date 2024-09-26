from flask import Flask
app = Flask(__name__)

@app.route("/api/python")
def hello_world():

    # write a tmp file to the /tmp directory
    with open("/tmp/test.txt", "w") as f:
        f.write("Hello, World!")

    print("file written to /tmp/test.txt")

        
    return "<p>file written to /tmp/test.txt</p>"