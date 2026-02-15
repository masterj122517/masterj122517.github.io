# Image Guide for MasterJ's LostLand

## Where to Store Images

### Option 1: Public Folder (Recommended for simplicity)
Put your images in `public/images/` folder.

**Structure:**
```
public/
└── images/
    ├── neovim-demo.jpg
    ├── rime-setup.png
    └── stoicism-quote.jpg
```

**Access in posts:**
- Thumbnail in frontmatter: `image: "/images/neovim-demo.jpg"`
- Inline images in markdown: `![Image description](/images/neovim-demo.jpg)`

### Option 2: Content Assets (For optimization)
Create `src/content/blog/images/` folder.

**Structure:**
```
src/content/blog/
├── images/
│   ├── neovim-demo.jpg
│   └── rime-setup.png
└── your-post.md
```

## How to Use Images

### 1. Post Thumbnail (Card Image)
In your markdown frontmatter:

```yaml
---
title: "My Post Title"
image: "/images/your-image.jpg"
---
```

### 2. Inline Images in Content
Standard markdown syntax:

```markdown
![Image description](/images/your-image.jpg)
```

### 3. Resized Images (using Unsplash placeholders)
For optimized images, use Unsplash with dimensions:

```yaml
image: "https://images.unsplash.com/photo-xxx?w=600&h=400&fit=crop"
```

## Best Practices

1. **Image Formats:**
   - Use `.jpg` for photos
   - Use `.png` for screenshots with text
   - Use `.webp` for better compression (if supported)

2. **Image Sizes:**
   - Thumbnails: 600x400px (recommended)
   - Inline images: Keep under 1MB each

3. **File Naming:**
   - Use lowercase: `my-image.jpg` (not `My-Image.jpg`)
   - Use hyphens: `neovim-setup.jpg` (not spaces)

## Example Post with Images

```markdown
---
title: "My Neovim Setup"
description: "How I configure Neovim"
date: 2026-02-07
image: "/images/neovim-thumbnail.jpg"
category: "Tech"
tags: ["Neovim", "Linux"]
---

Here's my Neovim setup:

![My Neovim configuration](/images/neovim-config.png)

## Installation

The installation is simple:

![Installation steps](/images/install.jpg)
```

## Recommended Workflow

1. Save images to `public/images/`
2. Use `/images/filename.jpg` in posts
3. Test locally with `npm run dev`
4. Images will be deployed to GitHub Pages automatically
