import os
from PIL import Image, ImageDraw, ImageFont

UPDATES_DIR = r"c:\Users\黄启言\Desktop\我的世界gemini\game\assets\updates"
os.makedirs(UPDATES_DIR, exist_ok=True)

# Sources
NANJING_BEFORE = r"C:\Users\黄启言\.gemini\antigravity\brain\0231937a-9265-4d1e-87cd-cf1b3e60633a\.user_uploaded\media_1791685671995_1a34d908.png"
NANJING_AFTER = r"C:\Users\黄启言\.gemini\antigravity\brain\0231937a-9265-4d1e-87cd-cf1b3e60633a\shot_nanjing_night_after_open.png"

SKY_BEFORE = r"C:\Users\黄启言\.gemini\antigravity\brain\0231937a-9265-4d1e-87cd-cf1b3e60633a\shot_sky_earliest_before.png"
SKY_AFTER = r"C:\Users\黄启言\.gemini\antigravity\brain\0231937a-9265-4d1e-87cd-cf1b3e60633a\shot_sky_current_after.png"

FONT_PATH = r"C:\Windows\Fonts\msyh.ttc"

def load_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except:
        return ImageFont.load_default()

font_badge = load_font(18)
font_label = load_font(20)

def create_comparison_card(before_path, after_path, before_label, after_label, out_compare_path, out_before_path, out_after_path):
    img_b = Image.open(before_path).convert("RGB")
    img_a = Image.open(after_path).convert("RGB")

    target_w = 640
    target_h = 360

    # Crop to 16:9 then resize
    def fit_16_9(img):
        w, h = img.size
        target_ratio = 16 / 9
        curr_ratio = w / h
        if curr_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
        return img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    im_b_fitted = fit_16_9(img_b)
    im_a_fitted = fit_16_9(img_a)

    im_b_fitted.save(out_before_path, quality=92)
    im_a_fitted.save(out_after_path, quality=92)

    # Composite combined image: 1280 + 4 px divider = 1284 x 360
    gap = 4
    canvas_w = target_w * 2 + gap
    canvas_h = target_h
    comp = Image.new("RGB", (canvas_w, canvas_h), (25, 33, 44))

    comp.paste(im_b_fitted, (0, 0))
    comp.paste(im_a_fitted, (target_w + gap, 0))

    draw = ImageDraw.Draw(comp, "RGBA")

    # Draw divider line
    draw.rectangle([target_w, 0, target_w + gap - 1, canvas_h], fill=(70, 90, 115, 255))

    # Function to draw badge pill
    def draw_badge(x, y, text, bg_color, border_color):
        bbox = font_badge.getbbox(text)
        bw = bbox[2] - bbox[0] + 18
        bh = bbox[3] - bbox[1] + 12
        draw.rounded_rectangle([x, y, x + bw, y + bh], radius=6, fill=bg_color, outline=border_color, width=1)
        draw.text((x + 9, y + 4), text, font=font_badge, fill=(255, 255, 255, 255))

    # Badges
    draw_badge(16, 16, "更新前 (BEFORE)", (20, 20, 20, 210), (230, 70, 70, 255))
    draw_badge(target_w + gap + 16, 16, "更新后 (AFTER)", (15, 35, 25, 210), (80, 220, 140, 255))

    # Bottom caption bars
    def draw_caption(x, w, text):
        bar_h = 38
        draw.rectangle([x, canvas_h - bar_h, x + w, canvas_h], fill=(10, 16, 26, 200))
        draw.text((x + 16, canvas_h - bar_h + 8), text, font=font_label, fill=(235, 245, 255, 255))

    draw_caption(0, target_w, before_label)
    draw_caption(target_w + gap, target_w, after_label)

    comp.save(out_compare_path, quality=93)
    print(f"Saved: {out_compare_path}")

# 1. Nanjing Road Night
create_comparison_card(
    NANJING_BEFORE,
    NANJING_AFTER,
    "早期街景 · 扁平立面与招牌信号缺失",
    "璀璨品牌霓虹 · 开放式旺铺与实心铺装",
    os.path.join(UPDATES_DIR, "nanjing_night_compare.jpg"),
    os.path.join(UPDATES_DIR, "nanjing_night_before.jpg"),
    os.path.join(UPDATES_DIR, "nanjing_night_after.jpg")
)

# 2. Lujiazui Sky
create_comparison_card(
    SKY_BEFORE,
    SKY_AFTER,
    "早期太阳月亮雷同 · 几何硬球与无光晕",
    "真实大气散射 · 柔和光晕光芒与轻盈云层",
    os.path.join(UPDATES_DIR, "lujiazui_sky_compare.jpg"),
    os.path.join(UPDATES_DIR, "lujiazui_sky_before.jpg"),
    os.path.join(UPDATES_DIR, "lujiazui_sky_after.jpg")
)

print("All comparison cards generated successfully!")
