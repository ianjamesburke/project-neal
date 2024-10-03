import json
import vercel_kv
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure environment variables are loaded
KV_URL = os.getenv("KV_URL")
KV_REST_API_URL = os.getenv("KV_REST_API_URL")
KV_REST_API_TOKEN = os.getenv("KV_REST_API_TOKEN")
KV_REST_API_READ_ONLY_TOKEN = os.getenv("KV_REST_API_READ_ONLY_TOKEN")

# Log the loaded environment variables for debugging
print(f"KV_URL: {KV_URL}")
print(f"KV_REST_API_URL: {KV_REST_API_URL}")
print(f"KV_REST_API_TOKEN: {KV_REST_API_TOKEN}")
print(f"KV_REST_API_READ_ONLY_TOKEN: {KV_REST_API_READ_ONLY_TOKEN}")

# Initialize KV with explicit configuration
kv_config = vercel_kv.KVConfig(
    url=KV_URL,
    rest_api_url=KV_REST_API_URL,
    rest_api_token=KV_REST_API_TOKEN,
    rest_api_read_only_token=KV_REST_API_READ_ONLY_TOKEN
)

kv = vercel_kv.KV(kv_config=kv_config)

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