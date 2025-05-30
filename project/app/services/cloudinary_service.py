import os
import requests
import time
import hashlib
from dotenv import load_dotenv
import base64
from io import BytesIO

load_dotenv()

CLOUD_NAME = "ddsltjt75"
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")


from io import BytesIO

def upload_base64_to_cloudinary(base64_string: str) -> str:
    if base64_string.startswith("data:image"):
        base64_string = base64_string.split(",")[1]

    file_bytes = base64.b64decode(base64_string)

    timestamp = int(time.time())
    params_to_sign = f"timestamp={timestamp}{API_SECRET}"
    signature = hashlib.sha1(params_to_sign.encode('utf-8')).hexdigest()

    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"

    payload = {
        'api_key': API_KEY,
        'timestamp': timestamp,
        'signature': signature,
    }

    files = {
        'file': ("image.png", BytesIO(file_bytes), "image/png"),
    }

    response = requests.post(url, data=payload, files=files, verify=False)
    response.raise_for_status()
    return response.json()["secure_url"]


def upload_to_cloudinary(file):
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    timestamp = int(time.time())
    signature = hashlib.sha1(f"timestamp={timestamp}{API_SECRET}".encode('utf-8')).hexdigest()

    payload = {
        'api_key': API_KEY,
        'timestamp': timestamp,
        'signature': signature,
    }
    files = {
        'file': (file.filename, file.file, file.content_type),
    }

    response = requests.post(url, data=payload, files=files, verify=False)
    response.raise_for_status()
    return response.json()["secure_url"]