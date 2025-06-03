from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from app.services.cloudinary_service import upload_to_cloudinary, upload_base64_to_cloudinary
from app.services.gemini_service import generate_image_from_prompt
from app.services.serpapi_service import search_with_google_lens, extract_products
from fastapi.responses import JSONResponse

router = APIRouter()

class PromptRequest(BaseModel):
    description: str

@router.post("/generate-image")
async def generate_image(request: PromptRequest):
    try:
        base64_image = generate_image_from_prompt(request.description)
        return JSONResponse(content={"image": base64_image})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/search-products/")
async def search_products(file: UploadFile = File(...)):
    try:
        image_url = upload_to_cloudinary(file)
        serp_data = search_with_google_lens(image_url)
        products = extract_products(serp_data)
        return JSONResponse(content={"products": products})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@router.post("/generate-and-search/")
async def generate_and_search(request: PromptRequest):
    try:
        # Step 1: Generate image (await async function)
        base64_image = generate_image_from_prompt(request.description)

        # Step 2: Upload to Cloudinary
        image_url = upload_base64_to_cloudinary(base64_image)

        # Step 3: Search products using Google Lens
        serp_data = search_with_google_lens(image_url)
        products = extract_products(serp_data)

        return {
            "image_url": image_url,
            "products": products
        }

    except Exception as e:
        return {"error": str(e)}