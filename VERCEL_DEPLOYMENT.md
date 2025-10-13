# Vercel Deployment Guide

This document explains how to deploy the Quote of the Day Web Notifier to Vercel as a serverless application.

## Quick Navigation

- **[Option A: Deploy via Vercel Dashboard](#option-a-deploy-via-vercel-dashboard)** - Simple web-based deployment
- **[Option B: Deploy via CLI](#option-b-deploy-via-cli)** - Command-line deployment  
- **[Option C: Deploy from GitHub](#option-c-deploy-from-github-recommended-for-continuous-deployment)** - ⭐ **Recommended** - Full GitHub integration with automatic deployments

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

### Option C: Deploy from GitHub (Recommended for Continuous Deployment)

> **Note**: This is the recommended deployment method for most users as it provides automatic deployments, preview environments, and the best developer experience.
> 
> **📸 Screenshots**: This guide includes placeholders for screenshots at key steps. In practice, you would see these screens as you follow the process.

This method sets up automatic deployments from your GitHub repository. Every time you push changes to your main branch, Vercel will automatically build and deploy your application.

#### Prerequisites for GitHub Deployment

Before starting, ensure you have:
- Your GitHub repository forked or cloned to your GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- VAPID keys generated (see Step 1 above)
- Admin access to your GitHub repository

#### Step-by-Step GitHub Integration

**1. Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account (recommended) or create a separate Vercel account
   - *Screenshot placeholder: Vercel login page*

**2. Create a New Project**
   - Click the "New Project" button on your Vercel dashboard
   - *Screenshot placeholder: Vercel dashboard with "New Project" button highlighted*

**3. Import from GitHub**
   - Select "Import Git Repository" 
   - Choose GitHub as your Git provider
   - If this is your first time connecting GitHub to Vercel, you'll need to authorize Vercel to access your GitHub repositories
   - *Screenshot placeholder: Git provider selection screen*

**4. Repository Authorization (First-time setup)**
   - Click "Install Vercel for GitHub"
   - Choose whether to give Vercel access to all repositories or select specific repositories
   - For security, it's recommended to select only the repositories you want to deploy
   - Select your `QTODWebNotifier` repository
   - *Screenshot placeholder: GitHub authorization screen*

**5. Select Your Repository**
   - Find and select your `QTODWebNotifier` repository from the list
   - Click "Import" next to your repository
   - *Screenshot placeholder: Repository selection screen with QTODWebNotifier highlighted*

**6. Configure Project Settings**
   - **Project Name**: Vercel will suggest a name based on your repository (you can change this)
   - **Framework Preset**: Select "Other" or leave as "No Framework Detected" (our app doesn't use a specific framework)
   - **Root Directory**: Leave as "./" (root of the repository)
   - **Build and Output Settings**: Leave as default (Vercel will auto-detect from `vercel.json`)
   - *Screenshot placeholder: Project configuration screen*

**7. Add Environment Variables**
   Before deploying, add your VAPID keys:
   - Click "Environment Variables" section
   - Add the following variables:
     ```
     VAPID_PUBLIC_KEY = [Your VAPID public key]
     VAPID_PRIVATE_KEY = [Your VAPID private key]
     ```
   - Make sure to apply these to "Production", "Preview", and "Development" environments
   - For detailed environment variable management, see [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
   - *Screenshot placeholder: Environment variables configuration*

**8. Deploy**
   - Click "Deploy" to start your first deployment
   - Vercel will automatically:
     - Clone your repository
     - Install dependencies (`npm install`)
     - Build your serverless functions
     - Deploy your static assets
   - This process usually takes 1-3 minutes
   - *Screenshot placeholder: Deployment in progress screen*

**9. Deployment Success**
   - Once complete, you'll see a success screen with your deployment URL
   - Click "Visit" to test your deployed application
   - *Screenshot placeholder: Successful deployment screen*

#### Setting Up Automatic Deployments

After the initial deployment, Vercel automatically sets up continuous deployment:

**Automatic Triggers:**
- **Push to main branch**: Any commit pushed to your main branch will trigger a deployment
- **Pull request previews**: Pull requests will generate preview deployments
- **Manual deployments**: You can also trigger deployments manually from the Vercel dashboard

**Branch Configuration:**
- Go to your project settings in Vercel
- Under "Git", you can configure which branch triggers production deployments
- By default, it's set to your main branch (usually `main` or `master`)
- *Screenshot placeholder: Git settings showing production branch configuration*

#### Managing Your GitHub Integration

**Webhook Configuration:**
Vercel automatically sets up webhooks in your GitHub repository:
- Go to your GitHub repository settings
- Click "Webhooks" in the left sidebar
- You should see a Vercel webhook that handles deployment triggers
- *Screenshot placeholder: GitHub webhooks page showing Vercel webhook*

**Deployment Status in GitHub:**
- GitHub will show deployment status checks on your commits and pull requests
- Green checkmarks indicate successful deployments
- Red X marks indicate deployment failures
- *Screenshot placeholder: GitHub commit status showing Vercel deployment check*

#### Testing Your Continuous Deployment

To verify everything is working:

1. **Make a test change**:
   ```bash
   # Clone your repository locally if you haven't already
   git clone https://github.com/[your-username]/QTODWebNotifier.git
   cd QTODWebNotifier
   
   # Make a small change (e.g., update a quote or modify text)
   # Edit any file, like adding a comment to README.md
   
   # Commit and push the change
   git add .
   git commit -m "Test automatic deployment"
   git push origin main
   ```

2. **Monitor the deployment**:
   - Go to your Vercel dashboard
   - You should see a new deployment starting automatically
   - The deployment will show up in real-time
   - *Screenshot placeholder: Vercel dashboard showing new deployment triggered by git push*

3. **Verify the update**:
   - Once deployment completes, visit your live URL
   - Confirm your changes are reflected
   - Test the push notification functionality

#### Environment Variables Management for GitHub Deployments

For GitHub deployments, you can manage environment variables after deployment:

**Via Vercel Dashboard:**
- Go to Project Settings > Environment Variables
- Add, edit, or delete variables as needed
- Changes to environment variables require a new deployment to take effect

**Triggering Redeployment after Environment Variable Changes:**
- Push a new commit to your main branch, OR
- Use the "Redeploy" button in Vercel dashboard, OR
- Use the Vercel CLI: `vercel --prod`

> **Tip**: For detailed environment variable setup during initial deployment, see the instructions in step 7 above.

#### Troubleshooting GitHub Deployments

**Common Issues and Solutions:**

1. **Deployment fails with "Repository not found"**
   - Ensure Vercel has access to your repository
   - Check if the repository is private and Vercel has proper permissions
   - Re-authorize Vercel for GitHub in your GitHub settings

2. **Environment variables not working**
   - Verify variables are set for the correct environment (production)
   - Check for typos in variable names
   - Redeploy after adding new environment variables

3. **Push notifications not working**
   - Verify both VAPID keys are correctly set
   - Test the `/api/vapid-public-key` endpoint in your browser
   - Check browser console for errors

4. **Automatic deployments not triggering**
   - Check GitHub webhooks are properly configured
   - Verify you're pushing to the correct branch (usually `main`)
   - Check Vercel deployment logs for any errors

5. **Build failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are listed in `package.json`
   - Verify `vercel.json` configuration is correct

**Getting Help:**
- Check deployment logs in your Vercel dashboard
- Review the [Vercel documentation](https://vercel.com/docs)
- Check the [GitHub integration guide](https://vercel.com/docs/concepts/git/vercel-for-github)

#### Advanced GitHub Integration Features

**Preview Deployments:**
- Every pull request automatically gets a preview deployment
- Preview URLs are posted as comments on the pull request
- Perfect for testing changes before merging to main

**Rollback Capabilities:**
- Instantly rollback to any previous deployment from the Vercel dashboard
- Use `vercel --rollback` CLI command
- GitHub commits can be reverted and automatically deployed

**Custom Domains:**
- Add custom domains through Vercel dashboard
- Automatic SSL certificate provisioning
- DNS configuration guidance provided

#### Summary: Why Choose GitHub Integration?

The GitHub integration method provides:

✅ **Automatic Deployments** - Push to deploy, no manual steps needed  
✅ **Preview Environments** - Every pull request gets its own preview URL  
✅ **Easy Rollbacks** - One-click rollback to any previous deployment  
✅ **Status Checks** - See deployment status directly in GitHub  
✅ **Team Collaboration** - Perfect for teams working on the same project  
✅ **Professional Workflow** - Industry-standard CI/CD setup  

This GitHub integration method provides the best developer experience with automatic deployments, preview environments, and seamless CI/CD workflow.

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to Settings > Environment Variables and add:

- **VAPID_PUBLIC_KEY**: Your VAPID public key
- **VAPID_PRIVATE_KEY**: Your VAPID private key
- **REDIS_URL**: Your Vercel KV Redis connection string (recommended method)
  OR
- **KV_REST_API_URL**: Your Vercel KV REST API URL (alternative method)
- **KV_REST_API_TOKEN**: Your Vercel KV REST API token (alternative method)
- **CRON_SECRET**: A secure random string for cron job authentication (optional but recommended)

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

To add daily notifications, you can:

1. **Use Vercel Cron Jobs** (Recommended):
   The repository includes an example cron endpoint at `/api/cron-notify.js` that demonstrates scheduled notifications. The `vercel.json` file is already configured to run this daily:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron-notify",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```

   To enable this in production:
   - Uncomment the cron configuration in `vercel.json`
   - Implement database storage for subscriptions in the cron endpoint
   - Add `CRON_SECRET` environment variable for security
   - Configure Vercel KV environment variables (`REDIS_URL` or `KV_REST_API_URL` and `KV_REST_API_TOKEN`)

2. **Use GitHub Actions**:
   Create a GitHub Action that calls your `/api/send-notification` endpoint daily.

3. **Use External Cron Services**:
   Services like cron-job.org can hit your API endpoint on a schedule.

## Database Integration

For production use, replace the in-memory subscription storage with a database:

### Setting Up Vercel KV (Recommended)

1. **Create KV Database**:
   - Go to your Vercel dashboard
   - Navigate to Storage tab
   - Click "Create Database" > "KV"
   - Choose a name for your database
   - Select a region close to your users

2. **Get Connection Details**:
   - After creation, go to the database settings
   - Copy the "REST API" credentials:
     - `KV_REST_API_URL`: The REST endpoint URL
     - `KV_REST_API_TOKEN`: The authentication token

3. **Add Environment Variables**:
   - In your Vercel project settings > Environment Variables
   - Add both `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   - Apply to all environments (Production, Preview, Development)

4. **Example Implementation**:
```javascript
// Example with Vercel KV
import { kv } from '@vercel/kv';

// Store subscription
await kv.lpush('subscriptions', JSON.stringify(subscription));

// Get all subscriptions
const subscriptions = await kv.lrange('subscriptions', 0, -1);

// Remove invalid subscription
await kv.lrem('subscriptions', 1, JSON.stringify(invalidSubscription));
```

### Security Best Practices

⚠️ **Never commit sensitive credentials to your repository**:

- ✅ Use Vercel environment variables for all secrets
- ✅ Use `.env.local` for local development (already in `.gitignore`)
- ✅ Rotate credentials regularly
- ❌ Don't hardcode connection strings in your code
- ❌ Don't commit `.env` files to Git

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

### Local Environment Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your credentials** to `.env.local`:
   - VAPID keys for push notifications
   - Vercel KV credentials for database storage
   - Optional CRON_SECRET for scheduled notifications

3. **Start development server**:
   ```bash
   vercel dev
   ```

For detailed database setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md).