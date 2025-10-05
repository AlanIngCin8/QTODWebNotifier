# Vercel Deployment Guide

This document explains how to deploy the Quote of the Day Web Notifier to Vercel as a serverless application.

## Prerequisites

1. A GitHub account with this repository
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. Generate VAPID keys for push notifications

## Step 1: Generate VAPID Keys

Run this command locally to generate new VAPID keys:

```bash
node -e "const webpush = require('web-push'); console.log(webpush.generateVAPIDKeys());"
```

Save the output - you'll need both the `publicKey` and `privateKey`.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Before deploying, add environment variables:
   - `VAPID_PUBLIC_KEY`: Your generated public key
   - `VAPID_PRIVATE_KEY`: Your generated private key
6. Click "Deploy"

### Option B: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From your project directory:
   ```bash
   vercel login
   vercel
   ```

3. Follow the prompts and add environment variables when asked.

### Option C: Deploy from GitHub

1. Connect your GitHub repository to Vercel
2. Push changes to your main branch
3. Vercel will automatically deploy on each push

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to Settings > Environment Variables and add:

- **VAPID_PUBLIC_KEY**: Your VAPID public key
- **VAPID_PRIVATE_KEY**: Your VAPID private key

## Step 4: Test Your Deployment

1. Visit your Vercel deployment URL
2. The app should detect that it's running on a server with API support
3. Try the "Enable Notifications" button to test push notifications
4. Use "Send Test Notification" to verify everything works

## Serverless Architecture

The application is converted to serverless functions:

- `/api/quote.js` - Get random quotes
- `/api/vapid-public-key.js` - Get VAPID public key for subscriptions
- `/api/subscribe.js` - Handle push notification subscriptions
- `/api/send-notification.js` - Send push notifications

## Important Notes for Serverless

1. **No Persistent State**: Unlike the original server.js, serverless functions don't maintain state between requests
2. **No Scheduled Tasks**: The `setInterval` for hourly notifications is removed. For scheduled notifications, use:
   - Vercel Cron Jobs
   - GitHub Actions with webhooks
   - External cron services

3. **Subscription Storage**: The current implementation logs subscriptions but doesn't persist them. For production, integrate with:
   - Vercel KV
   - Supabase
   - MongoDB Atlas
   - Any other database service

## Adding Scheduled Notifications

To add hourly notifications, you can:

1. **Use Vercel Cron Jobs** (Recommended):
   The repository includes an example cron endpoint at `/api/cron-notify.js` that demonstrates scheduled notifications. The `vercel.json` file is already configured to run this hourly:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron-notify",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

   To enable this in production:
   - Uncomment the cron configuration in `vercel.json`
   - Implement database storage for subscriptions in the cron endpoint
   - Add `CRON_SECRET` environment variable for security

2. **Use GitHub Actions**:
   Create a GitHub Action that calls your `/api/send-notification` endpoint hourly.

3. **Use External Cron Services**:
   Services like cron-job.org can hit your API endpoint on a schedule.

## Database Integration

For production use, replace the in-memory subscription storage with a database:

```javascript
// Example with Vercel KV
import { kv } from '@vercel/kv';

// Store subscription
await kv.lpush('subscriptions', JSON.stringify(subscription));

// Get all subscriptions
const subscriptions = await kv.lrange('subscriptions', 0, -1);
```

## Troubleshooting

1. **API not working**: Check that your environment variables are set correctly
2. **Push notifications not working**: Verify VAPID keys are properly configured
3. **CORS errors**: The API functions include CORS headers, but check browser console for issues

## Local Development

To test locally with serverless functions:

```bash
npm install vercel -g
vercel dev
```

This will run the serverless functions locally at `http://localhost:3000`.