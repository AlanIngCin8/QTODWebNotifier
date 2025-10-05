# QTODWebNotifier
Quote of the Day - Web app to demo push notifications

A Progressive Web App (PWA) that delivers inspiring quotes from famous people as push notifications. Perfect for testing PWA functionality and push notifications on iPhone and iPad.

## Features

- 📱 **Progressive Web App (PWA)** - Install on your home screen like a native app
- 🔔 **Push Notifications** - Receive quotes as notifications even when the app is closed
- ⏰ **Hourly Notifications** - Automatic quotes delivered every hour
- 🧪 **Test Button** - Manual notification testing
- 💬 **Famous Quotes** - Curated collection of inspiring quotes from well-known figures
- 📱 **Mobile Optimized** - Designed specifically for iPhone and iPad

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/AlanIngCin8/QTODWebNotifier.git
   cd QTODWebNotifier
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access the app:**
   Open your browser and go to `http://localhost:3000`

## How to Install on iPhone/iPad

### Option 1: Local Development (for testing)
1. Make sure your phone and computer are on the same WiFi network
2. Find your computer's IP address:
   - **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows**: `ipconfig`
3. Start the server: `npm start`
4. On your iPhone/iPad, open Safari and go to `http://[YOUR_IP]:3000`
5. Tap the Share button (📤) 
6. Select "Add to Home Screen"
7. Tap "Add" to install the app

### Option 2: GitHub Pages (Static Demo Version)
1. **Live Demo**: Visit the GitHub Pages deployment at `https://[username].github.io/QTODWebNotifier`
2. **Features Available**:
   - ✅ Quote browsing with "Get New Quote" button
   - ✅ PWA installation (Add to Home Screen)
   - ✅ Responsive design and mobile optimization
   - ❌ Push notifications (requires server backend)
3. **Perfect for**: Testing PWA installation and quote browsing functionality

### Option 3: Deploy to a Server (recommended for full testing)
1. Deploy to platforms like:
   - **Heroku**: `git push heroku main`
   - **Vercel**: `vercel --prod`
   - **Netlify**: Connect your GitHub repo
   - **Railway**: `railway up`

2. Access your deployed URL on iPhone/iPad Safari
3. Follow the same "Add to Home Screen" steps

## How Push Notifications Work

1. **Enable Notifications**: 
   - Open the app and tap "Enable Notifications"
   - Grant permission when prompted by Safari

2. **Test Notifications**:
   - Use the "Send Test Notification" button to verify setup
   - You should receive a notification immediately

3. **Automatic Hourly Quotes**:
   - Once subscribed, you'll receive a new quote every hour
   - Notifications work even when the app is closed
   - Perfect for motivation throughout the day!

## Technical Details

### Push Notification Flow
1. **Service Worker Registration**: App registers a service worker for background functionality
2. **VAPID Keys**: Uses VAPID (Voluntary Application Server Identification) for secure push messaging
3. **Subscription**: Browser creates a unique subscription endpoint
4. **Server Storage**: Subscription is stored on the server
5. **Notification Delivery**: Server sends notifications to all subscribed devices

### API Endpoints
- `GET /` - Main app interface
- `GET /api/quote` - Get a random quote
- `GET /api/vapid-public-key` - Get VAPID public key for subscriptions
- `POST /api/subscribe` - Subscribe to push notifications
- `POST /api/send-notification` - Send test notification

### PWA Features
- **App Manifest**: Enables "Add to Home Screen" functionality
- **Service Worker**: Handles push notifications and offline capability
- **Responsive Design**: Optimized for mobile devices
- **App Icons**: Multiple sizes for different devices

## Troubleshooting

### Notifications Not Working?
1. **Check Browser Support**: Push notifications require Safari 16.4+ on iOS
2. **HTTPS Required**: For production, your site must use HTTPS
3. **Permission Denied**: Clear browser data and try enabling notifications again
4. **Service Worker Issues**: Check browser developer tools for errors

### Can't Install as PWA?
1. **Use Safari**: PWA installation only works in Safari on iOS
2. **HTTPS Required**: PWA features require HTTPS in production
3. **Manifest Issues**: Check that manifest.json is loading correctly

### Development Tips
- **Local Testing**: Use ngrok or similar tools to expose localhost with HTTPS
- **Debug Mode**: Check browser console for detailed error messages
- **Service Worker**: Clear service worker cache during development

## Deployment

### GitHub Pages (Automatic)
This repository includes GitHub Actions workflow for automatic deployment to GitHub Pages:

- **Workflow**: `.github/workflows/deploy.yml`
- **Triggers**: Push to main branch, Pull Requests, Manual trigger
- **Deploy URL**: `https://[username].github.io/QTODWebNotifier`
- **Features**: Static demo version with quote browsing and PWA installation

## Environment Variables

For production deployment of the full server version, set these environment variables:


```bash
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
PORT=3000
```

Generate new VAPID keys with:
```bash
node -e "const webpush = require('web-push'); console.log(webpush.generateVAPIDKeys());"
```

## License

MIT License - feel free to use this project for learning and experimentation!

## Contributing

This is a demo project, but feel free to submit issues or pull requests if you find bugs or have improvements!
