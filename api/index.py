from flask import Flask
app = Flask(__name__)



@app.route("/api/python")
def hello_world():

    # write a tmp file to the /tmp directory
    with open("/tmp/test.txt", "w") as f:
        f.write("Hello, World!")
    
    import requests
    from io import BytesIO
    from PIL import Image

    # download the file from the url
    url = "https://utfs.io/f/mWiSbu5B60JIta8T6SnKzNZBbl4YLFm6rt7D8EuTWRiGQSC5"
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))

    # trim the image
    img = img.crop((100, 100, 400, 400))

    # save the trimmed image
    img.save("/tmp/trimmed_image.jpg")

    print("file written to /tmp/trimmed_image.jpg")
        
    return "<p>file written to /tmp/test.txt</p>"