"""
Prepares the hero portrait for the eye-tracking effect. Run once when the portrait
changes:  python3 scripts/prepare-portrait.py path/to/portrait.png

Outputs
  src/assets/portrait/portrait.webp, portrait-sm.webp  base image with the irises
                                                       painted out (inpainted)
  src/assets/portrait/iris-left.webp, iris-right.webp  each iris, cut from the original
  src/data/portrait.json                               geometry used by HeroPortrait.jsx

The base's iris areas are rebuilt as eye-white, row by row, from the white on either
side; each iris patch is the iris disc limited to the eye opening inset 2 px inside the
lash line, and the base is repainted in exactly that region. So the face at rest is
identical to the original, and a moving iris never drags a piece of eyelid along. Iris centres and radii were measured from the image: the iris edges are where the
white of the eye begins on the horizontal line through the pupil (the pupil's own
dark pixels are skewed by lid shadow). The eye openings were traced by hand on a
3x zoom and checked against the image, because the whites of the eyes are too
shaded for automatic thresholding to find the eyelids reliably.

Requires: pillow, numpy, opencv-python-headless
"""
import json, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'assets-source/portrait.png'

EYES = {
    'left': {
        'center': (489.9, 541.0), 'r': 40.5,
        'opening': [(411.7,555),(420,540),(433.3,528.3),(450,520),(466.7,513.3),(490,510.7),(513.3,512.7),
                    (530,520),(543.3,533.3),(551.7,550),(553.3,570),(546.7,571.7),(526.7,578.3),(506.7,580.7),
                    (480,580.7),(460,577.3),(440,570),(423.3,563.3)],
    },
    'right': {
        'center': (781.2, 540.0), 'r': 41.0,
        'opening': [(705,566.7),(713.3,550),(726.7,535),(743.3,523.3),(763.3,516),(783.3,514),(803.3,516.7),
                    (820,523.3),(840,535),(853.3,545),(860,553.3),(853.3,563.3),(836.7,573.3),(813.3,579.3),
                    (786.7,581),(760,580),(736.7,576),(716.7,570)],
    },
}
# Largest iris movement, in source pixels. Horizontal room inside the openings is 23 px
# or more on every side; vertically the iris already fills the opening, so less.
MAX_X, MAX_Y = 9, 4
PAD = 6  # extra pixels around each iris patch (covers RIM and the soft edge)

img = Image.open(SRC).convert('RGBA')
W, H = img.size
rgba = np.array(img)
bgr = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2BGR)

lum = 0.2126 * rgba[..., 0] + 0.7152 * rgba[..., 1] + 0.0722 * rgba[..., 2]
yy_full, xx_full = np.mgrid[0:H, 0:W]

INSET = 2  # px: the traced outline sits on the lash line; stay just inside it
RIM = 3.5  # px beyond the measured radius that still belongs to the iris

def inset_polygon(points, amount=INSET):
    """Moves each point of the outline `amount` px towards the shape's centre."""
    pts = np.array(points, float)
    centre = pts.mean(axis=0)
    direction = centre - pts
    direction /= np.linalg.norm(direction, axis=1, keepdims=True)
    return pts + direction * amount

def opening_mask(eye):
    """Anti-aliased mask of the inset eye opening, 0..1."""
    mask = np.zeros((H, W), np.uint8)
    cv2.fillPoly(mask, [np.round(inset_polygon(eye['opening']) * 4).astype(np.int32)], 255, lineType=cv2.LINE_AA, shift=2)
    return mask.astype(float) / 255

def iris_alpha(eye):
    """Where the iris patch is drawn: the iris disc, inside the inset opening."""
    cx, cy = eye['center']
    # r + RIM: the iris's dark outer rim extends slightly past where the white begins;
    # it must move with the iris, or a dark arc is left behind in the base.
    disc = np.clip((eye['r'] + RIM - np.hypot(xx_full + 0.5 - cx, yy_full + 0.5 - cy)), 0, 1)
    return disc * opening_mask(eye)

# 1. Paint the irises out of the base. The white under each iris is rebuilt row by row,
#    blending from the white just left of the iris to the white just right of it. (A
#    generic inpaint pulled dark lid colours into the white; this keeps the shading.)
base = rgba.astype(float).copy()
for eye in EYES.values():
    cx, cy = eye['center']
    r = eye['r']
    x_left, x_right = int(round(cx - r - 4)), int(round(cx + r + 4))
    fill = base[..., :3].copy()
    for y in range(int(cy - r - 3), int(cy + r + 4)):
        left = np.median(rgba[y, x_left - 4:x_left, :3].astype(float), axis=0)
        right = np.median(rgba[y, x_right:x_right + 4, :3].astype(float), axis=0)
        t = np.linspace(0, 1, x_right - x_left)[:, None]
        fill[y, x_left:x_right] = left * (1 - t) + right * t
    fill = cv2.GaussianBlur(fill, (0, 0), 1.2)
    # Repaint exactly where the iris patch will sit, and nowhere else, so the face at
    # rest is identical to the original.
    weight = iris_alpha(eye)[..., None]
    base[..., :3] = base[..., :3] * (1 - weight) + fill * weight
base_img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))

out_assets = ROOT / 'src/assets/portrait'
out_assets.mkdir(parents=True, exist_ok=True)
# Shown at up to 440 CSS px wide, so 900 px covers 2x screens; 600 px for phones.
for width, suffix in [(900, ''), (600, '-sm')]:
    base_img.resize((width, round(H * width / W)), Image.LANCZOS).save(
        out_assets / f'portrait{suffix}.webp', 'WEBP', quality=80, method=6)

# 2. Cut each iris out of the ORIGINAL, as a disc with a soft 1.5 px edge.
geometry = {'width': W, 'height': H, 'maxX': MAX_X, 'maxY': MAX_Y, 'eyes': {}}
for name, eye in EYES.items():
    cx, cy = eye['center']
    r = eye['r']
    size = int(np.ceil((r + PAD) * 2))
    x0, y0 = round(cx - size / 2), round(cy - size / 2)
    patch = rgba[y0:y0 + size, x0:x0 + size].copy()
    alpha = iris_alpha(eye)[y0:y0 + size, x0:x0 + size]
    patch[..., 3] = (alpha * 255).astype(np.uint8)
    Image.fromarray(patch).save(out_assets / f'iris-{name}.webp', 'WEBP', quality=90, method=6)
    geometry['eyes'][name] = {
        'cx': cx, 'cy': cy, 'r': r,
        'patch': {'x': x0, 'y': y0, 'size': size},
        # The clip shape: the traced opening, inset so it stays inside the lash line.
        'opening': [[round(float(x), 1), round(float(y), 1)] for x, y in inset_polygon(eye['opening'])],
    }

(ROOT / 'src/data/portrait.json').write_text(json.dumps(geometry, indent=2) + '\n')
print('base', base_img.size, 'patches', {k: v['patch'] for k, v in geometry['eyes'].items()})
