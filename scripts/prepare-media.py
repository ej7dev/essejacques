"""Prepares project media for the site: a 720 px variant of every image and a manifest of real sizes.

Run after adding or replacing a file in public/img/projects or public/video:
    python3 scripts/prepare-media.py
Needs ImageMagick (magick) and ffprobe. Writes app/data/media.json.
"""
import json, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public/img/projects")
VIDEO = os.path.join(ROOT, "public/video")
SMALL = 720


def size_of_image(path):
    out = subprocess.run(["magick", "identify", "-format", "%w %h", path], capture_output=True, text=True, check=True).stdout
    return [int(v) for v in out.split()[:2]]


def size_of_video(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True).stdout
    return [int(v) for v in out.strip().strip(",").split(",")[:2]]


media = {}
for name in sorted(os.listdir(IMG)):
    if not name.endswith(".webp") or name.endswith("-sm.webp"):
        continue
    path = os.path.join(IMG, name)
    w, h = size_of_image(path)
    entry = {"w": w, "h": h}
    if w > SMALL + 100:
        small = path[:-5] + "-sm.webp"
        if not os.path.exists(small) or os.path.getmtime(small) < os.path.getmtime(path):
            subprocess.run(["magick", path, "-resize", f"{SMALL}x", "-quality", "80", small], check=True)
        entry["sm"] = SMALL
    media[f"/img/projects/{name}"] = entry
for name in sorted(os.listdir(VIDEO)):
    if name.endswith(".mp4"):
        w, h = size_of_video(os.path.join(VIDEO, name))
        media[f"/video/{name}"] = {"w": w, "h": h}

with open(os.path.join(ROOT, "app/data/media.json"), "w") as f:
    json.dump(media, f, indent=1, sort_keys=True)
print(f"{len(media)} files described")
