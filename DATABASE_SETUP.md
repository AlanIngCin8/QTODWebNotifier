# Database Setup Guide for QTODWebNotifier

This guide explains how to securely configure database storage for push notification subscriptions using Vercel KV.

## Why Database Storage?

The current implementation stores subscriptions in memory, which means:
- ❌ Subscriptions are lost when the server restarts
- ❌ Serverless functions can't access shared subscription data
- ❌ Cron jobs can't send notifications to stored subscribers

Database storage solves these issues by providing persistent, shared storage across all functions and deployments.

## Setting Up Vercel KV

### Step 1: Create KV Database

1. **Access Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Navigate to your project

2. **Create KV Database**:
   - Click on the "Storage" tab
   - Click "Create Database"
   - Select "KV" (Key-Value store)
   - Choose a database name (e.g., `qtod-subscriptions`)
   - Select a region close to your users for better performance

3. **Database Created**:
   - Your KV database will be created in a few seconds
   - You'll see it listed in your Storage dashboard

### Step 2: Get Connection Credentials

1. **Access Database Settings**:
   - Click on your newly created KV database
   - Go to the "Settings" tab

2. **Copy REST API Credentials**:
   - Find the "REST API" section
   - Copy these two values:
     - `KV_REST_API_URL`: The REST endpoint URL
     - `KV_REST_API_TOKEN`: The authentication token

⚠️ **Security Note**: These are sensitive credentials. Never commit them to your code repository.

### Step 3: Configure Environment Variables

#### For Vercel Deployment:

1. **Go to Project Settings**:
   - In your Vercel project dashboard
   - Click "Settings" tab
   - Select "Environment Variables"

2. **Add KV Variables**:
   ```
   Variable Name: KV_REST_API_URL
   Value: [Your KV REST API URL]
   Environments: Production, Preview, Development
   ```
   
   ```
   Variable Name: KV_REST_API_TOKEN  
   Value: [Your KV REST API Token]
   Environments: Production, Preview, Development
   ```

3. **Redeploy**: After adding environment variables, trigger a new deployment to apply them.

#### For Local Development:

1. **Create Local Environment File**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Credentials** to `.env.local`:
   ```env
   KV_REST_API_URL=https://your-kv-store.kv.vercel-storage.com
   KV_REST_API_TOKEN=your_kv_token_here
   ```

3. **Verify**: `.env.local` is already in `.gitignore` and won't be committed to Git.

## Database Schema

The KV database will store subscriptions as a list:

```javascript
// Key: 'subscriptions'
// Value: List of JSON strings, each representing a subscription object

// Example subscription object:
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BKt...",
    "auth": "Gt..."
  }
}
```

## API Usage Examples

Once configured, you can use Vercel KV in your API functions:

```javascript
import { kv } from '@vercel/kv';

// Store a new subscription
await kv.lpush('subscriptions', JSON.stringify(subscription));

// Get all subscriptions
const subscriptions = await kv.lrange('subscriptions', 0, -1);
const parsedSubscriptions = subscriptions.map(sub => JSON.parse(sub));

// Remove invalid subscription
await kv.lrem('subscriptions', 1, JSON.stringify(invalidSubscription));

// Get subscription count
const count = await kv.llen('subscriptions');
```

## Security Best Practices

### ✅ Do:
- Store all credentials in Vercel environment variables
- Use `.env.local` for local development
- Rotate credentials regularly
- Monitor database access logs
- Use HTTPS for all API requests

### ❌ Don't:
- Commit `.env` or `.env.local` files to Git
- Hardcode credentials in your source code
- Share credentials in chat, email, or documentation
- Use production credentials for development

## Troubleshooting

### Environment Variables Not Working:
1. Verify variables are set in correct environment (Production/Preview/Development)
2. Check for typos in variable names
3. Redeploy after adding new environment variables
4. Test with `console.log(process.env.KV_REST_API_URL)` (remove after testing)

### Connection Errors:
1. Verify your KV database is in the same Vercel account as your project
2. Check that the REST API URL is correct
3. Ensure the token hasn't expired or been revoked
4. Try creating a new token in the KV database settings

### Local Development Issues:
1. Ensure `.env.local` exists and has correct values
2. Restart your development server after adding environment variables
3. Verify Node.js can read the environment file

## Next Steps

After setting up the database:

1. **Update API endpoints** to use KV storage instead of in-memory arrays
2. **Implement subscription cleanup** to remove invalid endpoints
3. **Test the complete flow** from subscription to notification delivery
4. **Monitor database usage** to understand your storage needs

This database setup provides the foundation for reliable, persistent push notifications that work across server restarts and in serverless environments.