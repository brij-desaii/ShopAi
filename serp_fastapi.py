from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cloudinary
import cloudinary.uploader
import requests

import os
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERP_API_KEY")
print("🔑 SERPAPI_KEY Loaded:", SERPAPI_KEY)



# api_key = os.getenv("MY_API_KEY")

print("✅ This is the correct app_main.py being run")

app = FastAPI()

# Configure Cloudinary
# cloudinary.config(
#     cloud_name="ddsltjt75",
#     api_key=os.getenv("CLOUDINARY_API_KEY"),
#     api_secret="ZxggXifJSJQh2VeRcPA7Llzwg7E"
# )

cloudinary.config(
    cloud_name="ddsltjt75",
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")  # moved from hardcoded
)
 


@app.get("/")
def hello():
    return {"message": "Hello from FastAPI"}   

# Upload image to Cloudinary
def upload_to_cloudinary(file):
    upload_result = cloudinary.uploader.upload(file.file)
    print(upload_result["secure_url"])
    return upload_result["secure_url"]

# # Search similar products using SerpAPI
# def search_similar_products(image_url):
#     params = {
#         "engine": "google_reverse_image",
#         "image_url": image_url,
#         "api_key": SERPAPI_KEY
#     }
#     response = requests.get("https://serpapi.com/search.json", params=params)
#     return response.json()


def search_with_google_lens(image_url):
    params = {
        "engine": "google_lens",          # or "google_search", "google_images", etc.
        "url": image_url,                 # for google_lens
        "api_key": SERPAPI_KEY,
        "gl": "in",                       # optional: geolocation
        "hl": "en",                       # optional: language
        "q": "site:flipkart.com"          # ✅ restrict to Flipkart products
    }


    response = requests.get("https://serpapi.com/search.json", params=params)
    return response.json()

# Extract products
# def extract_products(data):
#     return [
#         {
#             "title": item.get("title"),
#             "link": item.get("link"),
#             "price": item.get("price"),
#             "thumbnail": item.get("thumbnail")
#         }
#         for item in data.get("shopping_results", [])
#     ]

def extract_products(data):
    disallowed_domains = ["instagram.com"]

    def is_allowed(link):
        return link and all(domain not in link for domain in disallowed_domains)

    return [
        {
            "title": item.get("title"),
            "link": item.get("link"),
            "thumbnail": item.get("thumbnail") or item.get("image"),
        }
        for item in data.get("visual_matches", [])
        if is_allowed(item.get("link", ""))
    ]

# def extract_products(data):
#     allowed_domains = ["flipkart.com", "myntra.com"]

#     def is_allowed(link):
#         return any(domain in link for domain in allowed_domains)

#     return [
#         {
#             "title": item.get("title"),
#             "link": item.get("link"),
#             "thumbnail": item.get("thumbnail") or item.get("image"),
#         }
#         for item in data.get("visual_matches", [])
#         if is_allowed(item.get("link", ""))
#     ]





# POST endpoint to accept image and return products
@app.post("/search-products/")
async def search_products(file: UploadFile = File(...)):
    try:
        image_url = upload_to_cloudinary(file)
        serp_data = search_with_google_lens(image_url)
        products = extract_products(serp_data)
        return JSONResponse(content={"products": products})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
