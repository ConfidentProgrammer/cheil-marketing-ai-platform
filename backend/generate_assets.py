import os
from PIL import Image, ImageDraw
import glob

# 1. Define standard marketing aspect resolutions
RATIOS = {
    "1_1_square": (1080, 1080),
    "9_16_story": (1080, 1920),
    "16_9_banner": (1920, 1080)
}

# 2. Programmatically defined 10 diverse, high-end studio & abstract backgrounds
BACKGROUND_PALETTES = [
    {"name": "midnight_purple_glow", "c1": (65, 40, 85), "c2": (15, 10, 25)},
    {"name": "deep_slate_metal", "c1": (45, 50, 60), "c2": (15, 18, 22)},
    {"name": "warm_champagne_cream", "c1": (245, 240, 235), "c2": (205, 198, 190)},
    {"name": "cyber_neon_violet", "c1": (95, 45, 115), "c2": (20, 10, 30)},
    {"name": "minimal_cool_grey", "c1": (220, 225, 230), "c2": (170, 175, 180)},
    {"name": "rich_plum_shadow", "c1": (55, 25, 45), "c2": (12, 5, 15)},
    {"name": "obsidian_carbon", "c1": (30, 30, 32), "c2": (10, 10, 10)},
    {"name": "soft_lavender_mist", "c1": (210, 200, 225), "c2": (150, 140, 165)},
    {"name": "sunset_dusky_rose", "c1": (110, 55, 75), "c2": (30, 15, 25)},
    {"name": "arctic_silver_fade", "c1": (235, 240, 245), "c2": (185, 190, 198)}
]

def create_vertical_gradient(width, height, color1, color2):
    """Generates a smooth vertical gradient image programmatically."""
    base = Image.new("RGB", (width, height), color1)
    top = Image.new("RGB", (width, height), color2)
    mask = Image.new("L", (width, height))
    
    mask_data = []
    for y in range(height):
        alpha = int(255 * (y / height))
        mask_data.extend([alpha] * width)
        
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def generate_bulk_pipeline():
    os.makedirs("output_assets", exist_ok=True)
    
    products = glob.glob("uploads/*.png")
    if not products:
        print("⚠️ No product images found in the 'products/' folder.")
        return

    logo_img = None
    if os.path.exists("assets/samsung_logo_white.png"):
        logo_img = Image.open("assets/samsung_logo_white.png").convert("RGBA")
    else:
        print("⚠️ 'samsung_logo.png' not found in root. Proceeding without logo.")

    total_generated = 0

    for product_path in products:
        prod_filename = os.path.basename(product_path)
        prod_name = os.path.splitext(prod_filename)[0]
        product_img = Image.open(product_path).convert("RGBA")
        
        for ratio_name, (target_w, target_h) in RATIOS.items():
            for bg in BACKGROUND_PALETTES:
                bg_img = create_vertical_gradient(target_w, target_h, bg["c1"], bg["c2"])
                canvas = bg_img.convert("RGBA")
                
                # Dynamic scaling coefficients based on aspect ratio
                if ratio_name in ["1_1_square", "9_16_story"]:
                    product_scale_ratio = 0.72  # Larger asset footprint for square/vertical
                    logo_scale_ratio = 0.18     # Larger prominent logo
                else:
                    product_scale_ratio = 0.52  # Standard size for wide 16:9 banners
                    logo_scale_ratio = 0.10
                
                # 1. Overlay Logo on Top-Left Corner with dynamic scaling
                if logo_img:
                    logo_target_w = int(target_w * logo_scale_ratio)
                    logo_percent = logo_target_w / float(logo_img.size[0])
                    logo_h_size = int(float(logo_img.size[1]) * float(logo_percent))
                    resized_logo = logo_img.resize((logo_target_w, logo_h_size), Image.Resampling.LANCZOS)
                    
                    padding = int(target_w * 0.04)
                    canvas.paste(resized_logo, (padding, padding), resized_logo)

                # 2. Scale and Center Product with dynamic sizing
                max_w = int(target_w * product_scale_ratio)
                w_percent = max_w / float(product_img.size[0])
                h_size = int(float(product_img.size[1]) * float(w_percent))
                resized_product = product_img.resize((max_w, h_size), Image.Resampling.LANCZOS)
                
                offset_x = (target_w - resized_product.size[0]) // 2
                offset_y = (target_h - resized_product.size[1]) // 2
                
                canvas.paste(resized_product, (offset_x, offset_y), resized_product)
                
                # 3. Save final asset
                output_path = f"output_assets/{prod_name}_{bg['name']}_{ratio_name}.jpg"
                canvas.convert("RGB").save(output_path, "JPEG", quality=95)
                total_generated += 1
                print(f"✅ Generated: {output_path}")

    print(f"\n🎉 Successfully bulk generated {total_generated} assets with dynamic scaling!")

if __name__ == "__main__":
    generate_bulk_pipeline()