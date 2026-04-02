# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a vanilla HTML/CSS/JavaScript website redesign project for Blowin' Cold AC, an HVAC company in Katy, TX. The project emphasizes modern web standards with no frameworks or libraries, targeting deployment to blowincoldac.fly.dev.

## Technical Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+) - NO frameworks or libraries
- **Backend:** PHP only if server-side functionality is required (contact forms, etc.)
- **Deployment:** Fly.io (blowincoldac.fly.dev)
- **Testing:** MCP Playwright for validation and comprehensive testing

## Development Commands
Since this is a vanilla web project, there are no build tools or package managers. Development workflow:

1. **Local Development:** Open HTML files directly in browser or use a simple HTTP server
2. **Testing:** Use MCP Playwright for automated testing - all functions must be tested before completion
3. **Deployment:** Deploy to Fly.io using fly.toml configuration (to be created)

## Architecture and Structure

### Required Pages
- **Homepage:** Video/image hero, services overview, testimonials, contact CTA
- **Services:** AC Repair, Installation, Maintenance, Emergency Services  
- **About Us:** Company history, team, service area (Katy, TX focus)
- **Contact:** Form, hours, service area map, emergency contact

### Design Requirements
- Full-screen hero section with video (fallback to static image)
- Oversized hero image/video with header bar and navigation
- Static logo linked to homepage
- Mobile-first responsive design
- Reference design: https://acofaz.net

### Company Information
```
Blowin' Cold AC
1023 Park Meadow Dr
Katy, TX 77450
Phone: 281-647-2653
Email: blowincoldac@yahoo.com
```

## Testing Requirements
**CRITICAL:** Use MCP Playwright for ALL validations. Test sprite must validate all functions before marking project complete.

### Test Coverage Areas:
- Navigation functionality (all devices)
- Form validation and submission
- Responsive design at all breakpoints
- Video hero performance
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization (PageSpeed 90+)

### Responsive Breakpoints
```css
/* Mobile First Approach */
/* Base: 320px - 767px */
/* Tablet: 768px - 1023px */ 
/* Desktop: 1024px - 1439px */
/* Large Desktop: 1440px+ */
```

## Code Quality Standards
- Clean, semantic HTML5 structure
- Pure CSS3 with Grid and Flexbox layouts
- BEM or similar CSS naming convention
- Modular JavaScript functions (ES6+)
- Cross-browser compatibility
- WCAG 2.1 AA accessibility compliance

## Performance and SEO Requirements
- Image optimization (WebP with fallbacks)
- Lazy loading for below-fold images
- Minified CSS/JS for production
- Local SEO focus: "AC repair Katy TX", "HVAC Katy Texas"
- Schema markup for local business
- XML sitemap and robots.txt

## Video Hero Specifications
- Format: MP4 (H.264) with WebM fallback
- Duration: 10-15 seconds loop
- Resolution: 1920x1080 minimum
- File size: < 5MB optimized for web
- Autoplay muted with accessibility controls

## Project Completion Criteria
**DO NOT mark complete until:**
1. All MCP Playwright tests pass
2. Test sprite validation successful
3. All pages responsive and functional
4. Video hero implemented (or fallback)
5. Contact form working
6. Deployed to blowincoldac.fly.dev
7. Performance metrics meet targets (PageSpeed 90+)
8. Accessibility standards met

## File Structure
```
/
├── index.html              # Homepage
├── services.html          # Services page
├── about.html             # About Us page
├── contact.html           # Contact page
├── css/
│   ├── main.css          # Main stylesheet
│   └── responsive.css    # Responsive styles
├── js/
│   ├── main.js           # Core JavaScript
│   └── forms.js          # Form handling
├── images/               # Optimized images
├── videos/               # Video assets
└── fly.toml             # Deployment configuration
```

## Important Notes
- NO jQuery or other JavaScript libraries
- NO CSS frameworks (Bootstrap, Tailwind, etc.)
- Test thoroughly at each milestone using MCP Playwright
- Maintain professional HVAC industry styling
- Ensure all contact information is accurate and functional