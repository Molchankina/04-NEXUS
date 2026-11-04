from pathlib import Path
from PIL import Image
import shutil
import os
PROJECT_DIR = Path(__file__).resolve().parent
BACKUP_DIR = PROJECT_DIR.parent / "NEXUS-image-backup"
MIN_SIZE = 500 * 1024
JPEG_QUALITY = 84
WEBP_QUALITY = 82
SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
SKIP_DIRS = {".git", "node_modules", "__pycache__"}
def compress_image(source, temporary):
    extension = source.suffix.lower()
    with Image.open(source) as image:
        image.load()
        icc_profile = image.info.get("icc_profile")
        exif = image.info.get("exif")
        if extension in {".jpg", ".jpeg"}:
            if image.mode not in ("RGB", "L"):
                image = image.convert("RGB")
            image.save(
                temporary,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
                exif=exif or b"",
                icc_profile=icc_profile
            )
        elif extension == ".webp":
            image.save(
                temporary,
                format="WEBP",
                quality=WEBP_QUALITY,
                method=6,
                exact=True,
                icc_profile=icc_profile,
                exif=exif or b""
            )
        elif extension == ".png":
            image.save(
                temporary,
                format="PNG",
                optimize=True,
                compress_level=9,
                icc_profile=icc_profile
            )
def main():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    processed = 0
    skipped = 0
    saved_bytes = 0
    print("\n=== NEXUS IMAGE OPTIMIZER ===\n")
    for folder, subfolders, filenames in os.walk(PROJECT_DIR):
        subfolders[:] = [
            name for name in subfolders
            if name not in SKIP_DIRS
        ]
        for filename in filenames:
            source = Path(folder) / filename
            if source.suffix.lower() not in SUPPORTED_FORMATS:
                continue
            original_size = source.stat().st_size
            if original_size <= MIN_SIZE:
                continue
            relative_path = source.relative_to(PROJECT_DIR)
            backup = BACKUP_DIR / relative_path
            temporary = source.with_name(
                source.stem + ".optimized" + source.suffix
            )
            try:
                compress_image(source, temporary)
                optimized_size = temporary.stat().st_size
                if optimized_size >= original_size:
                    temporary.unlink()
                    skipped += 1
                    print(f"Без изменений: {relative_path}")
                    continue
                if not backup.exists():
                    backup.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source, backup)
                temporary.replace(source)
                difference = original_size - optimized_size
                saved_bytes += difference
                processed += 1
                print(
                    f"Сжато: {relative_path} | "
                    f"{original_size / 1024:.0f} КБ → "
                    f"{optimized_size / 1024:.0f} КБ"
                )
            except Exception as error:
                if temporary.exists():
                    temporary.unlink()
                print(f"Ошибка: {relative_path} — {error}")
    print("\n=== РЕЗУЛЬТАТ ===")
    print(f"Обработано файлов: {processed}")
    print(f"Без изменений: {skipped}")
    print(f"Освобождено: {saved_bytes / (1024 * 1024):.2f} МБ")
    print(f"Резервные копии: {BACKUP_DIR}")
    print("\nГотово!")
if __name__ == "__main__":
    main()