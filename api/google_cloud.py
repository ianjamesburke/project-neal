import os
from google.cloud import storage
import moviepy.editor as mp
import requests
from io import BytesIO

# Constants
CREDENTIALS_FILE = 'creds-for-sandbox-google.json'
BUCKET_NAME = 'sandbox-bucket-1892304'
TEMP_DIR = '/tmp'


def initialize_gcs_client():
    """Initialize and return Google Cloud Storage client."""
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_FILE
    return storage.Client()

def get_bucket(client, bucket_name=BUCKET_NAME):
    """Get a GCS bucket."""
    return client.bucket(bucket_name)

def download_from_gcs(bucket, source_blob_name, destination_file_name):
    """Download a file from GCS."""
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

def upload_to_gcs(bucket, source_file_name, destination_blob_name):
    """Upload a file to GCS."""
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)

def trim_video(input_data, output_path, start_time, end_time):
    """Trim a video file from input data (file-like object or path)."""
    clip = mp.VideoFileClip(input_data).subclip(start_time, end_time)
    clip.write_videofile(output_path)

def read_file_from_gcs(bucket, source_blob_name):
    """Read a file from GCS and return its contents as bytes."""
    blob = bucket.blob(source_blob_name)
    return blob.download_as_bytes()

def write_file_to_gcs(bucket, destination_blob_name, data):
    """Write bytes data to a file in GCS."""
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(data, content_type='application/octet-stream')


def download_from_url(url):
    """Download a file from a URL and return it as bytes."""
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad responses
    return BytesIO(response.content)



# if __name__ == '__main__':
#     # Example usage
#     client = initialize_gcs_client()
#     bucket = get_bucket(client)
    
#     # Example of trimming a video from a URL
#     url = "https://utfs.io/f/mWiSbu5B60JISbnWtmTbIuWJV8nyPDQFXv0YmcE4dfi9HLTS"
#     input_data = download_from_url(url)
#     output_path = os.path.join(TEMP_DIR, 'downloaded_video.mp4')
#     upload_to_gcs(bucket, output_path, 'uploaded_video.mp4')

