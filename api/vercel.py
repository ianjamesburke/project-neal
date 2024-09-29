import os
import requests
import json

testing = False


# # Load the Vercel KV URL and token from environment variables
# KV_REST_API_URL = os.getenv('KV_REST_API_URL')
# KV_REST_API_TOKEN = os.getenv('KV_REST_API_TOKEN')

# MVP KV varriables 
KV_REST_API_URL = 'https://living-garfish-21472.upstash.io'
KV_REST_API_TOKEN = 'AVPgAAIjcDFhOWVjM2ViMjFkOWI0NjQzOWRiOWMzNzczMDQyZWRhYXAxMA'

# Headers for authorization
headers = {
    'Authorization': f'Bearer {KV_REST_API_TOKEN}',
    'Content-Type': 'application/json',
}



def set_key(key: str, value: str | dict) -> dict:
    try:
        url = f"{KV_REST_API_URL}/set/{key}"
        
        # Convert dict to JSON string if necessary
        if isinstance(value, dict):
            value = json.dumps(value)
        
        data = {"value": value}
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        raise Exception(f"Error setting key: {error}")


### TEST ####

if testing:
    print("Testing set_key with string 'test_key'")
    key = "test_key"
    url = f"{KV_REST_API_URL}/set/{key}"
    result = set_key(key="test_key", value="test_value")
    print("Result:", result, "\n")

    print("Testing set_key with dict")
    value = {"test_json_object": {"testing": "123"}}
    result = set_key(key="test_json_key", value=value)
    print("Result:", result, "\n")



def get_key(key: str) -> dict:
    try:
        url = f"{KV_REST_API_URL}/get/{key}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        result = response.json()
        
        # Parse the nested JSON structure
        if 'result' in result:
            inner_json = json.loads(result['result'])
            if 'value' in inner_json:
                try:
                    valid_json_result = json.loads(inner_json['value'])
                    return valid_json_result
                except json.JSONDecodeError:
                    return inner_json['value']
        
        return result
    except requests.exceptions.RequestException as error:
        raise Exception(f"Error getting key: {error}")
    except json.JSONDecodeError as error:
        raise Exception(f"Error parsing JSON: {error}")

### TEST ###

if testing:

    print("Testing get_key with string")
    test_key = "test_key"
    test_value = "test_value"
    set_key(key=test_key, value=test_value)
    result = get_key(key=test_key)
    print("Result:", result, "\n")

    print("Testing get_key with JSON string")
    test_key = "test_json_key"
    test_value = {"test_json_object": {"testing": "123"}}
    set_key(key=test_key, value=test_value)
    result = get_key(key=test_key)
    if isinstance(result, dict):
        print("Result is valid JSON:", result, "\n")
    else:
        raise Exception("Result is not valid JSON")