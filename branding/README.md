# Changing the app icon manually

The launcher icon is a normal set of PNG files — no code changes needed.

## Files that make up the icon

| File | Purpose |
|---|---|
| `branding/ic_launcher-512.png` | Master image (Play-store size, 512×512) |
| `app/src/main/res/mipmap-mdpi/ic_launcher.png` | 48×48 |
| `app/src/main/res/mipmap-hdpi/ic_launcher.png` | 72×72 |
| `app/src/main/res/mipmap-xhdpi/ic_launcher.png` | 96×96 |
| `app/src/main/res/mipmap-xxhdpi/ic_launcher.png` | 144×144 |
| `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` | 192×192 |
| `…/ic_launcher_round.png` (same folders) | Round variants, same sizes |

`app/src/main/AndroidManifest.xml` points at `@mipmap/ic_launcher` /
`@mipmap/ic_launcher_round` — swap the PNGs and you're done.

## The easy way (recommended)

```bash
# 1. overwrite the master image with your own design (keep it square)
cp ~/my-icon.png branding/ic_launcher-512.png
# 2. regenerate every density in one go (needs ImageMagick)
bash scripts/regen-icons.sh
# 3. ship it
git add -A && git commit -m "new launcher icon" && git push
```

The GitHub workflow rebuilds the APK automatically; download it from the
Actions run artifacts.

## The Android Studio way

1. Open the project in Android Studio.
2. Right-click `app/src/main/res` → **New → Image Asset**.
3. **Icon type:** Launcher Icons (Adaptive and Legacy).
4. Choose your image under *Path*, adjust the trim/resize sliders, set a
   background color, then **Next → Finish**.
   It regenerates all densities (and adaptive-icon XML) for you.

## Design tips

- Keep the subject inside the **center 66%** of the square — Android masks
  icons (circle, squircle, teardrop) and the edges get cut off.
- A 512×512 PNG with transparency or a flat violet background
  (`#5638a8` matches the app theme) both work fine.
- After installing a new build, Android may cache the old icon for a while;
  uninstalling the old APK first guarantees you see the new one.
