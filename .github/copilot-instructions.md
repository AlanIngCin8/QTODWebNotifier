# GitHub Copilot Instructions for QTODWebNotifier

## Project Overview
QTODWebNotifier is a Progressive Web App (PWA) that delivers inspiring quotes from famous people as push notifications. The project demonstrates modern web technologies including PWAs, push notifications, and service workers, with a focus on iPhone/iPad compatibility.

## Architecture & Technology Stack

### Core Technologies
- **Backend**: Node.js with Express.js server
- **Frontend**: Vanilla HTML, CSS, and JavaScript (no frameworks)
- **Push Notifications**: Web Push API with VAPID authentication
- **PWA Features**: Service Workers, Web App Manifest
- **Deployment**: Dual deployment model (static GitHub Pages + full server)

### Key Files & Structure
- `server.js` - Express server with push notification endpoints
- `public/index.html` - Main PWA interface with embedded styles/scripts
- `public/sw.js` - Service worker for push notifications and offline functionality
- `public/manifest.json` - PWA manifest for installation
- `.github/workflows/deploy.yml` - GitHub Pages deployment automation

## Dual Deployment Architecture
The project supports two deployment modes:

1. **Static GitHub Pages**: Quote browsing and PWA installation (no push notifications)
2. **Full Server**: Complete functionality including push notifications via VAPID

The code automatically detects the environment and shows appropriate UI/messaging.

## Coding Standards & Conventions

### JavaScript Style
- Use modern ES6+ features (const/let, arrow functions, async/await)
- Prefer vanilla JavaScript over frameworks for simplicity
- Use descriptive variable names and clear function names
- Include error handling and user feedback

### CSS Style
- Use modern CSS features (flexbox, grid, gradients, backdrop-filter)
- Mobile-first responsive design approach
- Apple-specific PWA optimizations for iOS
- Consistent spacing and modern visual design

### HTML Structure
- Semantic HTML5 elements
- Accessibility considerations
- PWA-specific meta tags and manifest links
- Inline styles/scripts for simplicity in this demo project

## Push Notification Implementation
- Uses Web Push API with VAPID keys for authentication
- Supports notification actions (View Quote, Close)
- Handles subscription management and error states
- Graceful fallbacks for unsupported browsers/environments

## PWA Best Practices Implemented
- Service worker for offline functionality and push handling
- Web app manifest with proper icons and theme colors
- Apple-specific meta tags for iOS installation
- Responsive design optimized for mobile devices
- Install prompts and user guidance

## Environment & Configuration
- VAPID keys configurable via environment variables
- Development vs production detection
- Port configuration via PORT environment variable
- CORS enabled for cross-origin requests

## Development Guidelines

### When Adding Features
- Maintain compatibility with both deployment modes
- Test PWA installation and push notifications
- Ensure mobile responsiveness, especially on iOS
- Follow the existing vanilla JavaScript patterns
- Update user guidance/documentation as needed

### Security Considerations
- VAPID keys should be kept secure in production
- HTTPS required for push notifications and PWA features
- Input validation for user data
- Proper error handling without exposing sensitive information

### Testing Approach
- Test in both static and server deployment modes
- Verify PWA installation on iOS Safari
- Test push notifications with different browsers
- Validate responsive design across devices

## Common Tasks & Patterns

### Adding New Quotes
- Update the quotes array in both `server.js` and `public/index.html`
- Maintain consistency between static and server versions

### Modifying Push Notifications
- Update notification options in `server.js` endpoints
- Modify service worker handling in `public/sw.js`
- Test subscription and notification flow

### UI/UX Changes
- Maintain the modern, mobile-first design approach
- Preserve Apple-specific PWA optimizations
- Keep accessibility and usability in mind

## Project Goals & Context
This is a demonstration/learning project focused on:
- PWA development and best practices
- Push notification implementation
- Cross-platform mobile web app development
- Modern web technologies without complex frameworks

The codebase prioritizes clarity, educational value, and practical demonstration over enterprise-scale architecture.