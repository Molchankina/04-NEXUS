from pathlib import Path
from PIL import Image, ImageOps
import shutil

ROOT = Path(__file__).parent

# Оригиналы каталога сохраняются за пределами проекта
BACKUP = ROOT.parent / "04-NEXUS-images-original-backup"

# Страницы: создаём WebP-копии, оригиналы не удаляем
PAGE_IMAGES = {
    "outlast/image": {
        "outlast-door-left.png": (754, 850),
        "outlast-door-right.png": (754, 850),
    },

    "until-dawn/images": {
        "ud-qte.png": (1600, 1600),
        "ud-exploration.png": (1600, 1600),
        "ud-choices.jpg": (1600, 1600),
    },

    "stray/images": {
        "stray-slums.jpg": (1376, 1781),
        "stray-residents.jpg": (936, 829),
        "b12-drone.png": (216, 266),
        "stray-cat.jpg": (1112, 1390),
        "stray-city.jpg": (1600, 1600),
        "stray-b12.jpg": (1190, 946),
        "stray-hero.jpg": (1920, 1920),
    },
}

def make_webp(folder, filename, max_size):
    source = ROOT / folder / filename

    if not source.exists():
        print(f"Не найден: {source}")
        return

    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)

        if "A" in image.getbands():
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        output = source.with_suffix(".webp")
        image.save(output, "WEBP", quality=90, method=6)

    old = source.stat().st_size / 1024
    new = output.stat().st_size / 1024

    print(f"\n{filename}")
    print(f"Было: {old:.1f} КБ")
    print(f"Стало: {new:.1f} КБ")
    print(f"Экономия: {old-new:.1f} КБ")

# 1. Оптимизация изображений игровых страниц
print("=== ИГРОВЫЕ СТРАНИЦЫ ===")

for folder, files in PAGE_IMAGES.items():
    for filename, size in files.items():
        make_webp(folder, filename, size)

# 2. Оптимизация каталога images/p и images/b
print("\n=== КАТАЛОГ NEXUS ===")

EXCLUDED = (
    "the_last_of_us",
    "the-last-of-us",
    "untill_dawn",
    "until_dawn",
    "until-down",
    "outlast",
    "it_takes_two",
    "it-takes-two",
)

total_before = 0
total_after = 0

for folder in ("images/p", "images/b"):
    directory = ROOT / folder

    for source in directory.iterdir():
        if not source.is_file():
            continue

        if source.suffix.lower() not in (".jpg", ".jpeg"):
            continue

        normalized = source.stem.lower()

        if any(word in normalized for word in EXCLUDED):
            print(f"Пропущено: {source.name}")
            continue

        backup = BACKUP / folder / source.name
        backup.parent.mkdir(parents=True, exist_ok=True)

        if not backup.exists():
            shutil.copy2(source, backup)

        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")

            temp = source.with_name(source.stem + ".optimized.jpg")

            image.save(
                temp,
                "JPEG",
                quality=90,
                optimize=True,
                progressive=True
            )

        before = source.stat().st_size
        after = temp.stat().st_size

        if after < before:
            temp.replace(source)
        else:
            temp.unlink()
            after = before

        total_before += before
        total_after += after

        print(
            f"{source.name}: "
            f"{before/1024:.1f} → {after/1024:.1f} КБ"
        )

print("\n=== ИТОГ ===")
print(f"Каталог: {total_before/1024:.1f} КБ")
print(f"После: {total_after/1024:.1f} КБ")
print(f"Экономия: {(total_before-total_after)/1024:.1f} КБ")
print("\nГотово!")  