import logging
from flask import Flask, request, jsonify
from openai import OpenAI
import os
from pydantic import BaseModel, Field
import uuid
import base64
import requests
import json
from dotenv import load_dotenv

### INITIALIZE APP ###
app = Flask(__name__)
app.debug = True


load_dotenv()

try:
    api_key = os.environ.get('OPENAI_API_KEY')
    client = OpenAI(api_key=api_key)
except Exception as e:
    raise Exception(f"Error: {e}")




### FUNCTIONS ###


def message_assistant(chat_log, thread_id=None):
    """
    Function to interact with the assistant.
    """
    if thread_id is None:
        thread = client.beta.threads.create()
        thread_id = thread.id

    # Add new messages to the existing thread
    for message in chat_log:
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role=message["role"],
            content=message["content"]
        )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread_id,
        assistant_id=os.getenv('CHAT_ASSISTANT_ID')
    )

    if run.status == 'completed':
        res = client.beta.threads.messages.list(thread_id=thread_id)
        response = json.loads(res.data[0].content[0].text.value)
        if not response:
            response = "no ai response"

        chat_log.append({"role": "assistant", "content": response['response']})

        ai_response = response['response']

        try:
            script_ready = response['script_ready']
        except:
            script_ready = False

        try:
            ask_for_uploads = response['ask_for_uploads']
        except:
            ask_for_uploads = False

        return ai_response, script_ready, ask_for_uploads, thread_id
    else:
        print(run.status)
        return f"openai assistant failed: {run.status}", None, None, thread_id


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

def start_video_render(payload):

    """
    Sends a video to creatomate and returns the render ID and video URL.

    encode/decode urls if nessesary
    """


    url = "https://api.creatomate.com/v1/renders"
    api_key = os.environ.get('CREATOMATE_API_KEY')
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # check if payload contains encoded urls


    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()  # Raises an error for bad status codes

    json_response = response.json()
    if isinstance(json_response, list) and len(json_response) > 0:
        render_id = json_response[0].get('id')
        video_url = json_response[0].get('url')
        return render_id, video_url
    else:
        raise Exception("Unexpected response format from creatomate API")

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
@app.route('/flask/render-status/<render_id>', methods=['GET'])
def render_status(render_id):
    try:
        status = get_render_status(render_id)
        return jsonify(status), 200
    except Exception as e:
        print(f"An error occurred in render_status: {e}")
        return jsonify({"error": "An error occurred while checking render status."}), 500



@app.route("/flask/message-assistant", methods=['POST'])
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
    


@app.route('/flask/build-payload', methods=['POST'])
def build_payload_route():
    try:
        data = request.json
        chat_log = data.get('chat_log', [])

        # TODO: Insert logic to get relevent footage for the users database,
        # I currently have a placeholder footage analysis object
        placeholder_footage_analysis = { 
            "footage_analysis": [   
                {
                    "url": "https://utfs.io/f/mWiSbu5B60JIlsdlbQfRjLq1DG8ZYt30f4NFUwruh6dXgnCl",
                    "clips": [
                        {
                            "description": "Someone using a fabric shaver",
                            "in_frame": 0,
                            "out_frame": 9
                        },
                        {
                            "description": "Someone using a fabric shaver",
                            "in_frame": 9,
                            "out_frame": 26
                        }
                    ]
                },
                {
                    "url": "https://utfs.io/f/mWiSbu5B60JISDpcFKTbIuWJV8nyPDQFXv0YmcE4dfi9HLTS",
                    "clips": [
                        {
                            "description": "Someone using a fabric shaver on a blue pair of shorts",
                            "in_frame": 0,
                            "out_frame": 23
                        }
                    ]
                },
                {
                    "url": "https://utfs.io/f/mWiSbu5B60JIHVLB3ODLDPsBZQR9AWmdNCqxkSh81V3Gtpyj",
                    "clips": [
                        {
                            "description": "Someone using a fabric shaver",
                            "in_frame": 0,
                            "out_frame": 27
                        }
                    ]
                }
            ]
        }

        placeholder_chat_log = [
            {"role": "user", "content": "a short video of someone using a fabric shaver"}
        ]

        context = build_context(chat_log, placeholder_footage_analysis)

        clips_list = make_call_to_generate_editing_script(context)
        payload = create_payload_from_clip_list_and_audio_url(clips_list)

        render_id, video_url = start_video_render(payload)

        return jsonify({"render_id": render_id, "video_url": video_url}), 202

    except Exception as e:
        logging.error(f"An error occurred in build_payload_route: {e}")
        return jsonify({"error": "An error occurred while starting the video rendering."}), 500