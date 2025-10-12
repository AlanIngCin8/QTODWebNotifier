// Example: Scheduled notification endpoint for Vercel Cron Jobs
// This file demonstrates how to add daily notifications using Vercel Cron Jobs
// See: https://vercel.com/docs/cron-jobs

import webpush from 'web-push';
import { quotes, vapidKeys } from './_shared.js';

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron (optional but recommended)
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Configure webpush with VAPID details
    webpush.setVapidDetails(
      'mailto:test@example.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    // In a real implementation, you would:
    // 1. Retrieve all subscriptions from your database
    // 2. Send notifications to all subscribers
    // 
    // For example with Vercel KV:
    // const { kv } = require('@vercel/kv');
    // const subscriptions = await kv.lrange('subscriptions', 0, -1);
    
    // For this demo, we'll just log that the cron job ran
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const payload = JSON.stringify({
      title: 'Daily Quote',
      body: `"${randomQuote.text}" - ${randomQuote.author}`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });

    console.log('Cron job executed at:', new Date().toISOString());
    console.log('Would send notification:', payload);
    
    // TODO: Implement actual notification sending with database-stored subscriptions
    // const results = await Promise.allSettled(
    //   subscriptions.map(sub => webpush.sendNotification(JSON.parse(sub), payload))
    // );

    res.status(200).json({ 
      success: true, 
      message: 'Daily notification cron job completed',
      timestamp: new Date().toISOString(),
      quote: randomQuote
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).json({ error: 'Cron job failed' });
  }
}

// To use this with Vercel Cron Jobs, add to vercel.json:
// {
//   "crons": [
//     {
//       "path": "/api/cron-notify",
//       "schedule": "0 0 * * *"
//     }
//   ]
// }