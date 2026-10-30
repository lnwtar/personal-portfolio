from pathlib import Path
from PIL import Image, ImageOps


PROJECT_ROOT = Path(r"C:\Users\Tatzaed03\Documents\Codex\2026-10-15\new-chat\personal-portfolio")
SCREENSHOTS = Path(r"C:\Users\Tatzaed03\OneDrive\รูปภาพ\Screenshots")
OUTPUT_ROOT = PROJECT_ROOT / "assets" / "projects"


SCREENSHOT_SELECTIONS = {
    "countball": [468, 472, 474, 475, 499, 501],
    "fashion-ecommerce": [580, 582, 596, 598, 604, 606],
    "smart-rehab": [711, 713, 721, 728, 743, 748],
    "vr-hospital": [765, 772, 786, 795, 803, 810],
    "seizure-mission-roblox": [1012, 1018, 1021, 1263, 1265, 1269, 1279],
    "badminton-pose-analysis": [1041, 1042, 1052, 1063, 1064, 1096],
    "v-resq": [1167, 1177, 1181, 1191, 1205, 1364, 1366, 1374, 1381],
}


DIRECT_SELECTIONS = {
    "ai-human-detection": [
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\ai\runs\detect\runs\detect\run_my_test\val_batch0_pred.jpg"),
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\ai\runs\detect\runs\detect\run_my_test\val_batch1_pred.jpg"),
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\ai\runs\detect\runs\detect\run_my_test\val_batch2_pred.jpg"),
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\ai\runs\detect\runs\detect\run_my_test\confusion_matrix.png"),
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\ai\runs\detect\runs\detect\run_my_test\BoxPR_curve.png"),
    ],
    "aruco-tracking": [
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\backOceanX\ArUcoProject\marker_0.png"),
        Path(r"C:\Users\Tatzaed03\OneDrive\Desktop\backOceanX\ArUcoProject\marker_1.png"),
    ],
    "onshape-product-modeling": [
        PROJECT_ROOT / "assets" / "images" / "onshape-product-stand.png",
        PROJECT_ROOT / "assets" / "images" / "onshape-stylus.png",
        PROJECT_ROOT / "assets" / "images" / "onshape-scissors.png",
    ],
}


def screenshot_files():
    return sorted(
        [p for p in SCREENSHOTS.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"}],
        key=lambda p: p.stat().st_mtime,
    )


def save_webp(source: Path, destination_stem: Path):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        for width in (960, 1600):
            rendered = image.copy()
            if rendered.width > width:
                height = round(rendered.height * width / rendered.width)
                rendered = rendered.resize((width, height), Image.Resampling.LANCZOS)
            destination = destination_stem.with_name(f"{destination_stem.name}-{width}.webp")
            rendered.save(destination, "WEBP", quality=90, method=6)
            print(destination.relative_to(PROJECT_ROOT), rendered.size)


def build():
    files = screenshot_files()
    for slug, indices in SCREENSHOT_SELECTIONS.items():
        output = OUTPUT_ROOT / slug
        output.mkdir(parents=True, exist_ok=True)
        for sequence, index in enumerate(indices, 1):
            source = files[index - 1]
            save_webp(source, output / f"gallery-{sequence:02d}")

    for slug, sources in DIRECT_SELECTIONS.items():
        output = OUTPUT_ROOT / slug
        output.mkdir(parents=True, exist_ok=True)
        for sequence, source in enumerate(sources, 1):
            if not source.exists():
                print("MISSING", source)
                continue
            save_webp(source, output / f"gallery-{sequence:02d}")


if __name__ == "__main__":
    build()
