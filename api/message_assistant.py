import os
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()

# Retrieve variables from environment
chat_assistant_id = os.getenv("CHAT_ASSISTANT_ID")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



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
        assistant_id=chat_assistant_id
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

        return ai_response, script_ready, thread_id
    else:
        print(run.status)
        return f"openai assistant failed: {run.status}", None, thread_id
    

def test_chat():
    chat_log = [
        {"role": "user", "content": "Hello, how are you?"}
        ]
    thread_id = None
    response, script_ready, thread_id = message_assistant(chat_log, thread_id)
    print("response:", response)
    print("script_ready:", script_ready)
    print("thread_id:", thread_id) 



if __name__ == "__main__":
    test_chat()