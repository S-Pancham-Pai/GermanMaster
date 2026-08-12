#!/usr/bin/env bash
# Regenerate all Android launcher-icon densities from ONE source image.
#
# Usage:
#   1. Drop your new icon at  branding/ic_launcher-512.png   (square, 512x512 px)
#   2. Run:  bash scripts/regen-icons.sh
#   3. Commit + push — the CI builds the APK with your icon.
#
# Notes:
#   - Needs ImageMagick ("convert"); on Ubuntu/Debian:  sudo apt install imagemagick
#   - The "round" icon is generated as a circular crop of your source.
#   - Keep anything important inside the center ~66%% of the image: Android
#     masks launcher icons and the edges get clipped on many phones.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${1:-branding/ic_launcher-512.png}"
if [ ! -f "$SRC" ]; then
  echo "Source icon not found: $SRC" >&2
  exit 1
fi

# density -> pixel size for launcher icons
SIZES="mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192"

for pair in $SIZES; do
  dir="${pair%%:*}"; px="${pair##*:}"
  out="app/src/main/res/mipmap-${dir}"
  mkdir -p "$out"
  convert "$SRC" -resize "${px}x${px}" "$out/ic_launcher.png"
  # circular crop for the round variant (precompute the radius — MVG can't do math;
  # mask must be transparent-canvas + PNG32 output, otherwise alpha is silently dropped)
  half=$((px / 2))
  convert "$SRC" -resize "${px}x${px}" \
    \( -size "${px}x${px}" xc:none -fill white -draw "circle ${half},${half} ${half},0" \) \
    -compose CopyOpacity -composite "PNG32:$out/ic_launcher_round.png"
  echo "wrote $out/ic_launcher{,_round}.png (${px}px)"
done
cp "$SRC" branding/ic_launcher-512.png 2>/dev/null || true
echo "Done. Commit the app/src/main/res/mipmap-* changes and push."
