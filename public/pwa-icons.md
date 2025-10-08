# PWA Icon Generation Instructions

To complete the PWA setup, you need to generate app icons. Here are two options:

## Option 1: Use Online Tool (Recommended)
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload your logo (square, at least 512x512px)
3. Generate icons
4. Download and place in `/public/` folder:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png` (180x180px)

## Option 2: Manual Creation
Create the following files in `/public/`:

### pwa-192x192.png
- Size: 192x192px
- Format: PNG
- Content: Your app logo with transparent background

### pwa-512x512.png
- Size: 512x512px
- Format: PNG  
- Content: Your app logo with transparent background

### apple-touch-icon.png
- Size: 180x180px
- Format: PNG
- Content: Your app logo (iOS style)

## Temporary Placeholder
For now, the app will use a fallback icon. Replace these files with your actual logo for production.

## Design Tips
- Use a simple, recognizable icon
- Ensure good contrast with white/dark backgrounds
- Leave some padding around edges
- Test on both light and dark themes
