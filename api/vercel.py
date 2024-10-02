import json
import vercel_kv
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
KV_URL="redis://default:AVPgAAIjcDFhOWVjM2ViMjFkOWI0NjQzOWRiOWMzNzczMDQyZWRhYXAxMA@living-garfish-21472.upstash.io:6379"
KV_REST_API_URL="https://living-garfish-21472.upstash.io"
KV_REST_API_TOKEN="AVPgAAIjcDFhOWVjM2ViMjFkOWI0NjQzOWRiOWMzNzczMDQyZWRhYXAxMA"
KV_REST_API_READ_ONLY_TOKEN="AlPgAAIgcDHZgxRC-1a_Ajlnc5cxL76FA4TmVItF361wtTEiF_6LyQ"


kv = vercel_kv.KV()


def set_key(key: str, value: str | dict) -> bool:
    try:
        # Convert dict to JSON string if necessary
        if isinstance(value, dict):
            value = json.dumps(value)
        
        result = kv.set(key, value)
        return result
    except Exception as error:
        raise Exception(f"Error setting key: {error}")



def get_key(key: str) -> str | dict:
    try:
        result = kv.get(key)
        
        # Try to parse the result as JSON
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return result
    except Exception as error:
        raise Exception(f"Error getting key: {error}")



# Test functions
def run_tests():
    print("Testing set_key and get_key with string")
    set_key("test_key", "test_value")
    result = get_key("test_key")
    print("Result:", result)
    print("Type:", type(result))
    print()

    print("Testing set_key and get_key with dict")
    test_dict = {"test_json_object": {"testing": "123"}}
    set_key("test_json_key", test_dict)
    result = get_key("test_json_key")
    print("Result:", result)
    print("Type:", type(result))
    print()

    print("Testing with a more complex dict")
    complex_dict = {
        "name": "John Doe",
        "age": 30,
        "skills": ["Python", "JavaScript", "React"],
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "country": "USA"
        }
    }
    set_key("complex_key", complex_dict)
    result = get_key("complex_key")
    print("Result:", result)
    print("Type:", type(result))



if __name__ == "__main__":
    run_tests()