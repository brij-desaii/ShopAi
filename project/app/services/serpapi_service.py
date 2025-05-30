import os
import requests
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERP_API_KEY")


def search_with_google_lens(image_url):
    params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": SERPAPI_KEY,
        "gl": "in",
        "hl": "en",
    }
    response = requests.get("https://serpapi.com/search.json", params=params, verify=False)
    return response.json()


def extract_products(data):
    usd_to_inr = 83

    def convert_price_to_inr(price_data):
        try:
            value_usd = price_data.get("extracted_value")
            if value_usd is not None:
                value_inr = round(value_usd * usd_to_inr)
                return f"\u20b9{value_inr}"
        except Exception:
            pass
        return None

    return [
        {
            "title": item.get("title"),
            "link": item.get("link"),
            "thumbnail": item.get("thumbnail") or item.get("image"),
            "price": convert_price_to_inr(item.get("price", {}))
        }
        for item in data.get("visual_matches", [])
        if item.get("price", {}).get("extracted_value") is not None
    ]