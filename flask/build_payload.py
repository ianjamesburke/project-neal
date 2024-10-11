from openai import OpenAI
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List
import uuid
import json
import base64

# Load environment variables from .env file
load_dotenv()

# Retrieve variables from environment
generate_scriptAssistantID = os.getenv("GENERATE_SCRIPT_ASSISTANT_ID")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ClipInfo(BaseModel):
    voiceover_source: str = Field(..., description="The AI generated voiceover for the clip")
    broll_url: str = Field(..., description="URL of the B-roll footage for this clip")
    clip_start_time: int = Field(..., description="Start time of the clip in seconds")
    clip_end_time: int = Field(..., description="End time of the clip in seconds")

class ScriptOutput(BaseModel):
    clips: List[ClipInfo] = Field(..., description="List of clips that make up the video")



def make_call_to_generate_editing_script(context):

    """
    Input is the chat log and footage analysis data

    """
    
    # Create a thread
    thread = client.beta.threads.create()

    # Add a message to the thread
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=context
    )

    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=os.getenv("GENERATE_SCRIPT_ASSISTANT_ID"),
    )

    # Wait for the run to complete
    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

    # Parse the content into our structured format
    parsed_content = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[{"role": "user", "content": context}],
        response_format=ScriptOutput
    )

    # Directly initialize the Pydantic model from the parsed content
    # output = ScriptOutput(**parsed_content)
    output = ScriptOutput(**parsed_content.dict())  # Ensure it's a dictionary


    # Convert each ClipInfo object to a dictionary
    clips = []
    for clip in output.clips:
        clip_dict = {
            "voiceover_source": clip.voiceover_source,
            "broll_url": clip.broll_url,
            "clip_start_time": clip.clip_start_time,
            "clip_end_time": clip.clip_end_time
        }
        clips.append(clip_dict)

    # Return the list of dictionaries
    return clips


def simplify_conversation(chat_log):
        simplified = []
        for entry in chat_log:
            if entry['role'] == 'user':
                simplified.append(f"User:\n[{entry['content']}]")
            elif entry['role'] == 'assistant':
                simplified.append(f"AI:\n [{entry['content']}]")
        return "\n".join(simplified)



def build_context(chat_log, footage_analysis) -> str:

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
        broll_url = base64.urlsafe_b64encode(broll_url.encode()).decode()

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



def build_payload(chat_log):

    # MVP encoding URL issue needs to be fixed

    # Placeholder footage analysis data
    with open('footage_analysis.json', 'r') as f:
        footage_analysis = json.load(f)

    # simple concatination
    context = build_context(chat_log, footage_analysis)

    # AI generated editing insrtuctions creation
    clips = make_call_to_generate_editing_script(context)

    # audio_url = random.choice(audio_urls)

    payload = create_payload_from_clip_list_and_audio_url(clips)

    placeholder_payload = {
        "output_format": "mp4",
        "width": 720,
        "height": 1280,
        "elements": [
                {
                "id": "3a5c2a24-8e21-49ac-835b-4382fd7c4f6d",
                "type": "video",
                "track": 1,
                "time": 0,
                "source": "aHR0cHM6Ly91dGZzLmlvL2YvbVdpU2J1NUI2MEpJdXBHT1J2VmZWZ0tNNzBpSGJkVURUNDkyc0Y4WlExY09YcnFu"
                }
            ]
        }



    return payload


if __name__ == "__main__":
    # test pip
    chat_log = [
        {"role": "user", "content": "a short video of someone using a fabric shaver"}
    ]
    context = build_context(chat_log, None)
    result = make_call_to_generate_editing_script(context)
    print(result)
