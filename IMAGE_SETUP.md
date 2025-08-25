# Image Setup Instructions

## 📸 Adding Your Images

### 1. Character Illustration (Front of flip)
- Save the character illustration from your Figma design as `character.png`
- Place it in the `assets/` folder: `assets/character.png`
- This will be the front side of the flip animation

### 2. Your Profile Photo (Back of flip)  
- Save your photo (IMG_7314) as `IMG_7314.jpg`
- Place it in the `assets/` folder: `assets/IMG_7314.jpg`
- This will be the back side that shows when you hover

### 3. Background Removal (Optional)
If you want to remove the background from your photo:

**Option A: Online Tools**
- Use [remove.bg](https://remove.bg) - Upload your photo and download the result
- Or use [Canva Background Remover](https://canva.com/bg-remover)

**Option B: Photoshop/GIMP**
- Use the magic wand or pen tool to select and delete the background
- Save as PNG to preserve transparency

### 4. File Structure
After adding images, your assets folder should look like:
```
assets/
├── character.png       (Character illustration from Figma)
├── IMG_7314.jpg       (Your profile photo)
└── .gitkeep           (Existing file)
```

### 5. Alternative: Use Placeholder URLs
If you prefer, you can also update the image sources in `index.html` to use direct URLs:
- Line 54: Update character image source
- Line 87: Update profile photo source

## 🔄 After Adding Images
1. Commit and push to GitHub: `git add . && git commit -m "Add profile images" && git push`
2. Deploy to Netlify - your images will be included in the deployment

## 🎯 Result
- **Hover over the center** → Character flips to show your real photo
- **Click 11 times** → Admin panel opens for editing
- **Clean, professional look** with your actual images
