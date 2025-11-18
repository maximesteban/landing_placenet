# Placenet - Immersive Presentation Website

An innovative, interactive presentation website for pitching Placenet's sixth sense technology.

## Features

### 🎨 Interactive Elements
- **Full-screen sections** with smooth transitions
- **Expandable cards** that reveal content on click
- **Animated text** with staggered reveals
- **Navigation dots** for quick section jumping
- **Progress bar** showing presentation progress
- **Continue buttons** to guide the viewer through the story

### ⚡ Animations (powered by GSAP)
- Smooth fade-in and slide animations
- Elastic and bounce effects for emphasis
- Staggered animations for lists and grids
- Hover effects with scale and shadow transitions
- Mobile swipe gestures

### 📱 Responsive Design
- **Desktop**: Full cinematic experience with keyboard navigation
- **Tablet**: Optimized layout with touch gestures
- **Mobile**: Mobile-first design with swipe navigation

## Navigation Methods

1. **Navigation Dots** (right side) - Click to jump to any section
2. **Continue Buttons** - Click to advance to next section
3. **Keyboard**:
   - Arrow Down / Page Down: Next section
   - Arrow Up / Page Up: Previous section
4. **Touch Gestures** (mobile):
   - Swipe up: Next section
   - Swipe down: Previous section

## Sections

1. **Apertura** - Opening with animated title
2. **Intro** - Interactive reveal cards with questions
3. **Placenet** - Brand presentation with expandable info cards
4. **Impacto** - Grid of impact areas
5. **Casos de Uso** - Use case cards with expandable details
6. **Cierre** - Closing message and call to action

## How to Use

### Opening the Presentation
Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

### Interactive Elements

#### Reveal Cards (Intro Section)
- Click on any question to reveal additional content
- Click again to collapse
- Only one card can be open at a time

#### Info Cards (Placenet Section)
- Click on cards to expand and read full details
- Arrow indicator shows expandable content

#### Use Case Cards (Casos Section)
- Click "Ver más detalles" button to expand
- Click "Ver menos" to collapse
- Add your own media and content in the expanded areas

## Adding Media & Content

### Use Case Cards
Replace the placeholder content in `index.html` at the `.case-details` sections:

```html
<div class="case-details">
    <!-- Add your images, videos, or detailed descriptions here -->
    <img src="assets/f1-fanzone.jpg" alt="F1 Fan Zone">
    <p>Detailed description of the F1 Fan Zone implementation...</p>
</div>
```

### Logo Placeholders
Replace `.logo-placeholder` content with actual logos:

```html
<div class="case-logo">
    <img src="assets/logo-f1.png" alt="F1 Logo">
</div>
```

### Adding Images/Videos
1. Place media files in the `assets` folder
2. Reference them in HTML: `<img src="assets/your-image.jpg">`
3. For videos: `<video src="assets/your-video.mp4" controls></video>`

## Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --color-primary: #6366f1;  /* Main brand color */
    --color-secondary: #8b5cf6;
    --color-accent: #ec4899;
    --color-bg: #0f0f1e;       /* Background */
}
```

### Fonts
Update the font family in `styles.css`:

```css
:root {
    --font-main: 'Your-Font-Name', sans-serif;
}
```

Don't forget to import the font in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

### Animation Speed
Adjust in `styles.css`:

```css
:root {
    --transition-fast: 0.2s ease;
    --transition-base: 0.3s ease;
    --transition-slow: 0.6s ease;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with custom properties and animations
- **JavaScript (ES6+)** - Interactivity
- **GSAP 3.12.5** - Professional animations
- **ScrollTrigger** - Scroll-based animations (included with GSAP)

## Performance Tips

- Compress images before adding to `assets` folder
- Use modern image formats (WebP) for better performance
- Keep videos under 10MB for smooth loading
- Test on actual mobile devices for best results

## Next Steps

1. ✅ Open `index.html` in browser to preview
2. 📸 Add your logos and media to the `assets` folder
3. ✏️ Update use case details in HTML
4. 🎨 Customize colors to match your brand
5. 🚀 Deploy to web hosting

## Deployment

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Push your files
3. Enable GitHub Pages in repository settings

### Option 2: Netlify (Free)
1. Drag and drop your folder to netlify.com
2. Get instant live URL

### Option 3: Vercel (Free)
1. Import from GitHub or upload files
2. Automatic deployment

---

**Created with GSAP animations for a disruptive, immersive presentation experience.**
