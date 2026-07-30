import os
from google import genai
from google.genai import types
from PIL import Image, ImageDraw, ImageFont
from pinecone import Pinecone
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# Initialize Clients
genai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
hf_client = InferenceClient(api_key=os.environ.get("HF_TOKEN"))
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("samsung-brand-guard")

def generate_smart_banner():
    base_image_path = "uploads/flip6.png"
    logo_path = "assets/samsung_logo_white.png"
    output_path = "outputs/smart_pipeline_banner.png"
    
    campaign_brief = "Create a sleek marketing banner showing the phone's flex-window utility on a clean desk."
    banner_width = 1200
    banner_height = 630

    print("Step 1: Embedding campaign brief and querying Pinecone rules...")
    embedding_response = genai_client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=campaign_brief
    )
    query_vector = embedding_response.embeddings[0].values

    results = index.query(vector=query_vector, top_k=4, include_metadata=True)
    rules = [f"- {match['metadata']['text']}" for match in results.matches if match.metadata and "text" in match.metadata]
    brand_rules = "\n".join(rules) if rules else "Maintain high quality and brand standards."

    print("Step 2: Asking Gemini to inspect product asset and write a tailored FLUX background prompt...")
    if not os.path.exists(base_image_path):
        raise FileNotFoundError(f"Base product image missing at '{base_image_path}'.")
    
    product_image = Image.open(base_image_path)

    # Prompt Gemini to act as an Art Director
    # 1. Ask Gemini Art Director to analyze this specific product asset and create a minimalist, abstract background prompt
# 1. Ask Gemini Art Director to analyze this specific product asset and create a plain, elegant gradient background prompt
    # 1. Ask Gemini Art Director to write a strict, podium-free gradient background prompt for FLUX
    art_director_prompt = f"""
        You are a professional graphic designer. Look at this product asset and analyze its primary color palette (e.g., specific purple and rose tones).
        
        Campaign Brief: {campaign_brief}
        Compliance Rules: {brand_rules}
        
        Task: Write a concise text-to-image prompt for FLUX to generate a completely flat, abstract graphic design background. 
        It must consist ONLY of a smooth, vertical color gradient wash matching the product's tones. 
        MANDATORY DESIGN CONSTRAINTS: 
        - Perfectly smooth vertical color gradient.
        - Abstract graphic design backdrop only.
        - Absolutely empty space, flat 2D color field, soft atmospheric ambient glow.
        - Strictly NO 3D structures, NO floors, NO walls, NO tables, NO podiums, NO platforms, NO geometry of any kind.
        
        Return ONLY the raw prompt string for FLUX, with no extra conversational text.
        """
    # Call Gemini to generate the custom prompt
    gemini_prompt_response = genai_client.models.generate_content(
        model="gemini-3.5-flash-lite", # Fast text/multimodal call
        contents=[product_image, art_director_prompt]
    )
    
    custom_flux_prompt = gemini_prompt_response.text.strip()
    print(f"\n[Generated FLUX Prompt from Gemini]:\n{custom_flux_prompt}\n")

    print("Step 3: Generating background via FLUX using Gemini's custom prompt...")
    background = hf_client.text_to_image(
        prompt=custom_flux_prompt,
        model="black-forest-labs/FLUX.1-schnell"
    )
    bg_image = background.resize((banner_width, banner_height), Image.Resampling.LANCZOS).convert("RGBA")

    print("Step 4: Compositing base product asset onto the background...")
    product = Image.open(base_image_path).convert("RGBA")
    target_prod_width = int(banner_width * 0.32)
    w_percent = target_prod_width / float(product.size[0])
    target_prod_height = int(float(product.size[1]) * w_percent)
    product = product.resize((target_prod_width, target_prod_height), Image.Resampling.LANCZOS)

    x_pos = (banner_width - target_prod_width) // 2
    y_pos = int(banner_height * 0.35)
    bg_image.paste(product, (x_pos, y_pos), product)

    print("Step 5: Overlaying Logo and Compliance Text via Pillow...")
    overlay = Image.new("RGBA", bg_image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # Logo (Top Right)
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo_w = int(banner_width * 0.15)
        logo_h = int(logo.size[1] * (logo_w / float(logo.size[0])))
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        padding = int(banner_width * 0.05)
        overlay.paste(logo, (banner_width - logo_w - padding, padding), logo)

    # Compliance Text (Bottom Left)
    try:
        font = ImageFont.truetype("arial.ttf", 14)
        font_bold = ImageFont.truetype("arialbd.ttf", 14)
    except IOError:
        font = ImageFont.load_default()
        font_bold = font

    draw.text((40, banner_height - 60), "GALAXY Z FLIP6 | Professional 4K Output", font=font_bold, fill=(255, 255, 255, 240))
    draw.text((40, banner_height - 35), "Samsung Global Compliance Standards", font=font, fill=(255, 255, 255, 180))

    final_banner = Image.alpha_composite(bg_image, overlay)

    os.makedirs("outputs", exist_ok=True)
    final_banner.convert("RGB").save(output_path)
    print(f"Success! Smart pipeline banner saved to '{output_path}'.")

if __name__ == "__main__":
    generate_smart_banner()