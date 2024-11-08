import logging
from flask import Flask, request, jsonify
from openai import OpenAI
import os
from pydantic import BaseModel, Field
import uuid
import base64
import json
import requests
import string
import random
import time


### INITIALIZE APP ###
# Add logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
app.config['DEBUG'] = True


FLASK_ENV = os.getenv('FLASK_ENV')

if os.getenv('FLASK_ENV') == 'development':
    print("FLASK_ENV IS DEVELOPMENT")
    from dotenv import load_dotenv
    load_dotenv("../.env")



### SUPABASE ###
from supabase import create_client, Client
import os
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase_client: Client = create_client(url, key)
print("Supabase client created")



try:
    api_key = os.environ.get('OPENAI_API_KEY')
    client = OpenAI(api_key=api_key)
except Exception as e:
    raise Exception(f"Error: {e}")


def simplify_conversation(chat_log):
    simplified = []
    for entry in chat_log:
        if entry['role'] == 'user':
            simplified.append(f"User:\n[{entry['content']}]")
        elif entry['role'] == 'assistant':
            simplified.append(f"AI:\n [{entry['content']}]")
    return "\n".join(simplified)

def build_context(chat_log: list, footage_analysis: dict) -> str:
    
    """
    retunrs a list of dicts in this format:
    [{'voiceover_source': str, 
    'broll_url': str, 
    'clip_start_time': int, 
    'clip_end_time': int}]

    """

    simplified_chat = simplify_conversation(chat_log)

    context = f'''
    the following is a chat log of a user interacting with an AI assistant talking about how their video should be edited.
    
    CHAT LOG START:
    {simplified_chat}
    CHAT LOG END

    This is the footage.
    It's a list of video URLs with timecoded descriptions.
    pick the best shot for each line.
    feel free to move the start and end times around to fit the video.

    B-Roll Descriptions:
    {footage_analysis}

    '''
    return context

def make_call_to_generate_editing_script(context):
    
    """
    Input is the chat log and footage analysis data
    
    """

    class ClipInfo(BaseModel):
        voiceover_source: str
        broll_url: str
        clip_start_time: int
        clip_end_time: int

    class ScriptOutput(BaseModel):
        clips: list[ClipInfo]


    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": """You are an AI video editor that takes in chat, logs, and video descriptions and outputs a json list of voiceover and accompanying footage.Do not include any extra styling in the VoiceOver line each voiceover line should be no more than two sentences. Don't enclose the voice source in quotes."""},
            {"role": "user", "content": context},
        ],
        response_format=ScriptOutput,
    )
    

    result = completion.choices[0].message.parsed
    clips = result.model_dump()
    clips_list = clips.get('clips', [])

    return clips_list

def create_payload_from_clip_list_and_audio_url(data: dict) -> dict:
    try:
        clips = data.get('clips', [])
    except:
        clips = data
    
    payload = {
        "output_format": "mp4",
        "width": 720,
        "height": 1280,
        "snapshot_time": 1.28,
        "source": {  # 'source' is now an object with an 'elements' array
            "elements": []
        }
    }
    
    for index, clip in enumerate(clips):
        voiceover_source = clip["voiceover_source"]
        broll_url = clip["broll_url"]

        voiceover_id = str(uuid.uuid4())  # Generate ID for voiceover

        # Create a new composition for each clip
        composition = {
            "id": str(uuid.uuid4()),
            "type": "composition",
            "track": 1,
            "dynamic": True,
            "elements": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "video",
                    "track": 1,
                    "time": 0,
                    "duration": None,
                    "dynamic": True,
                    "source": broll_url,
                    "volume": "0%"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": f"Subtitles-{index+1}",
                    "type": "text",
                    "track": 2,
                    "time": 0,
                    "width": "86.66%",
                    "height": "37.71%",
                    "x_alignment": "50%",
                    "y_alignment": "50%",
                    "fill_color": "#ffffff",
                    "stroke_color": "#333333",
                    "stroke_width": "1.05 vmin",
                    "font_family": "Montserrat",
                    "font_weight": "700",
                    "font_size": "8 vmin",
                    "background_color": "rgba(216,216,216,0)",
                    "background_x_padding": "26%",
                    "background_y_padding": "7%",
                    "background_border_radius": "28%",
                    "transcript_source": voiceover_id,  # Match voiceover ID
                    "transcript_effect": "highlight",
                    "transcript_color": "#ff0040"
                },
                {
                    "id": voiceover_id,  # Use the same ID for voiceover
                    "name": f"Voiceover-{index+1}",
                    "type": "audio",
                    "track": 3,
                    "time": 0,
                    "dynamic": True,
                    "source": voiceover_source,
                    "provider": "elevenlabs model_id=eleven_turbo_v2 voice_id=KrxBHh6TKZcyZjuExmqI stability=0.4 similarity_boost=0.5"
                }
            ]
        }
        payload["source"]["elements"].append(composition)

    print("audio file upload is currently commented out")
    
    # Add the final audio link element outside the compositions
    # final_audio = {
    #     "id": str(uuid.uuid4()),
    #     "type": "audio",
    #     "track": 2,
    #     "time": 0,
    #     "duration": None,
    #     "dynamic": True,
    #     "volume": "50%",
    #     "source": audio_url
    # }
    # base_json["source"]["elements"].append(final_audio)  # Append to the "source" object's elements list

    # with open('outgoing_payload.json', 'w') as f:
    #     json.dump(payload, f, indent=2)

    return payload

def encode_urls(payload):
    """
    Encodes URLs in the payload to base64 format.
    """
    elements = payload.get('source', {}).get('elements', [])
    for index, element in enumerate(elements):
        if isinstance(element, dict) and 'source' in element:
            if isinstance(element['source'], str):
                elements[index]['source'] = base64.urlsafe_b64encode(element['source'].encode()).decode()

# def start_video_render(payload):

#     """
#     Sends a video to creatomate and returns the render ID and video URL.

#     encode/decode urls if nessesary
#     """


#     url = "https://api.creatomate.com/v1/renders"
#     api_key = os.environ.get('CREATOMATE_API_KEY')
#     headers = {
#         "Authorization": f"Bearer {api_key}",
#         "Content-Type": "application/json"
#     }

#     # check if payload contains encoded urls


#     response = requests.post(url, headers=headers, json=payload)
#     response.raise_for_status()  # Raises an error for bad status codes

#     json_response = response.json()
#     if isinstance(json_response, list) and len(json_response) > 0:
#         render_id = json_response[0].get('id')
#         video_url = json_response[0].get('url')
#         return render_id, video_url
#     else:
#         raise Exception("Unexpected response format from creatomate API")

def get_render_status(render_id):
    url = f"https://api.creatomate.com/v1/renders/{render_id}"
    headers = {
        "Authorization": f"Bearer {os.environ.get('CREATOMATE_API_KEY')}",
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    data = response.json()
    return {
        "status": data.get('status'),
        "videoUrl": data.get('url')
    }
















### ROUTES ###

# test route
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"response": "hello"}), 200



@app.route('/api/chatbot', methods=['POST'])
def chat(data=None):
    if data is None:    
        data = request.json
    chat_log = data.get('chat_log', [])


    # check for "suggestions"
    latest_message = chat_log[-1].get('content', '')

    if latest_message == "Create a new project":
        # time.sleep(2)
        return jsonify({"response": "Sure! Let's create a new project. Select an option below to get started.", "script_ready": False, "ask_for_uploads": False, "suggestions": ["Start from scratch", "Upload reference TikTok"]}), 200

    if latest_message == "Upload reference TikTok":
        # time.sleep(2)
        return jsonify({"response": "Sure! Please provide the link to a single TikTok video.", "script_ready": False, "ask_for_uploads": True}), 200
    
    # if latest_message is a link
    if latest_message.startswith("https://"):
        # fetch https://tiktok-transcriber-cloud-run-535483726398.us-west1.run.app/api/transcribe-tiktok
        response = requests.post(
            'https://tiktok-transcriber-cloud-run-535483726398.us-west1.run.app/api/transcribe-tiktok',
            json = {'url': latest_message}
        )

        if response.status_code == 200:
            data = response.json()
            transcript = data.get('transcription', '')
            logging.info(f"transcript: {transcript}")

            # toss in DB
            try:
                supabase_client.table('tiktoks').insert({
                    'transcript': transcript,
                    'url': latest_message
                }).execute()
            except Exception as e:
                logging.error(f"Error inserting tiktok into DB: {e}")

            return jsonify({"response": "Awesome! I analyzed the video and will use it to generate a script. Now do you have any footage you'd like to upload?", "script_ready": False, "ask_for_uploads": True}), 200
        else:
            return jsonify({"response": "Sorry, something went wrong. Let's continue for now. Tell me what product you're selling?", "script_ready": False, "ask_for_uploads": False}), 200




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



    # TEMP
    # messages = [{"role": "user", "content": "a short video of someone using a fabric shaver"}]

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        response_format=Response,
    )

    data = completion.choices[0].message.parsed



    return jsonify({"response": data.response, "script_ready": data.script_ready, "ask_for_uploads": data.ask_for_uploads}), 200



@app.route('/api/put-footage-url', methods=['POST'])
def put_footage_url():
    data = request.json
    footage_url = data.get('footage_url', '')
    
    # Validate URL is not empty
    if not footage_url:
        return jsonify({"success": False, "error": "No footage URL provided"}), 400

    name = ''.join(random.choices(string.ascii_letters + string.digits, k=6))

    try:
        response = supabase_client.table('project-neal-footage').insert({
            'ut_url': footage_url,
            'footage_name': name,
            'use': True,
            'type': 'B-Roll'
        }).execute()
        print("url added to db. response: ", response.data)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



@app.route('/api/get-footage-analysis', methods=['GET'])
def get_footage_analysis(data=None):
    """
    Go throught the DB and get list of all urls that don't have visual_analysis
    make a request to the footage analysis API for each url
    save the analysis to the db
    return a success message stating all urls have been processed
    """
    try:
        # Get all footage entries without visual analysis
        response = supabase_client.table('project-neal-footage').select('*').is_('visual_analysis', None).execute()
        footage_entries = response.data

        for entry in footage_entries:
                        # Make request to footage analysis API
            analysis_response = requests.post(
                'https://project-quincy-535483726398.us-central1.run.app/api/quincy',
                json = {
                    'url': entry['ut_url'],
                    'footage_name': entry['footage_name'],
                    'id': entry['id']
                }
            )

            # check for 500
            if analysis_response.status_code == 500:
                print("error: ", analysis_response.json())
                return jsonify({"success": False, "error": "Failed to get footage analysis"}), 500
            
            if analysis_response.status_code == 200:
                analysis_data = analysis_response.json()

                # Update DB with analysis results
                supabase_client.table('project-neal-footage').update({
                    'visual_analysis': analysis_data
                }).eq('footage_name', entry['footage_name']).execute()

        return jsonify({
            "success": True,
            "message": f"Successfully processed {len(footage_entries)} footage entries"
        }), 200

    except Exception as e:
        print(f"Error in get_footage_analysis: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500



@app.route('/api/get-render-status/<render_id>', methods=['GET'])
def get_render_status_route(render_id):
    try:
        status = get_render_status(render_id)
        return jsonify(status), 200
    except Exception as e:
        print(f"An error occurred in render_status: {e}")
        return jsonify({"error": "An error occurred while checking render status."}), 500


    

@app.route('/api/build-payload', methods=['POST'])
def build_payload_route(data=None):
    try:
        # Log incoming data
        logging.info(f"Received data: {data}")
        
        if data is None:    
            data = request.json
        logging.info(f"Processed data: {data}")

        try:
            chat_log = data.get('chat_log', [])
            logging.info(f"Chat log: {chat_log}")
        except Exception as chat_error:
            logging.error(f"Error processing chat_log: {chat_error}")
            chat_log = data


        # get footage url and analysis from db of row with 'use' = TRUE
        response = supabase_client.table('project-neal-footage').select('ut_url, visual_analysis, footage_name').eq('use', True).execute()
        footage_entries = response.data

        # create mapping, footage name to encoded urls
        footage_mapping = {}
        for entry in footage_entries:
            footage_mapping[entry['footage_name']] = entry['ut_url']

        simplified_analysis = []
        for entry in footage_entries:
            if entry.get('visual_analysis'):
                for clip in entry['visual_analysis'].get('clips', []):
                    simplified_analysis.append({
                        'footage_name': entry['footage_name'],
                        'description': clip.get('description'),
                        'trim': clip.get('trim')
                    })
        
        # simplify chat_log
        simplified_chat_log = simplify_conversation(chat_log)

        payload = {
            'footage_mapping': footage_mapping,
            'clips_list': simplified_analysis,
            'chat_log': simplified_chat_log
        }
        # make api request to https://project-quincy-535483726398.us-central1.run.app/generate-quincy-video
        response = requests.post(
            # 'http://localhost:8000/api/generate-quincy-video',
            'https://project-quincy-535483726398.us-central1.run.app/api/generate-quincy-video',
            json=payload
        )

        if response.status_code == 200:
            return jsonify({"success": True, "render_id": response.json().get('render_id'), "video_url": response.json().get('video_url')}), 200
        else:
            return jsonify({"success": False, "error": "Failed to generate Quincy video"}), 500

    except Exception as e:
        logging.error(f"An error occurred in build_payload_route: {str(e)}", exc_info=True)  # Added exc_info for stack trace
        return jsonify({"error": str(e)}), 500  # Return the actual error message
    