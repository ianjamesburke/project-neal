from supabase import create_client, Client
import os

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase_client: Client = create_client(url, key)
print("Supabase client created")