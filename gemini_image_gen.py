from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

common_image_context = (
    "A photorealistic, high-resolution image of a product, "
    "professional studio lighting, on a clean white background, "
    "front view."
)

# --- User's specific product description
user_product_description = 'black kurta with gold embroidery'

# --- Combine common context with user's description ---
full_prompt = f"{common_image_context} {user_product_description}"

print(f"Generating image with prompt: '{full_prompt}'")


# --- Gemini API Call ---
response = client.models.generate_content(
    model="gemini-2.0-flash-preview-image-generation",
    contents=full_prompt,
    config=types.GenerateContentConfig(
      response_modalities=['TEXT', 'IMAGE']
    )
)

image_path = 'gemini-native-image.png'
for part in response.candidates[0].content.parts:
  if part.text is not None:
    print(part.text)
  elif part.inline_data is not None:
    image = Image.open(BytesIO((part.inline_data.data)))
    image.save(image_path)
    image.show()

print(f"Image saved to {image_path}")
