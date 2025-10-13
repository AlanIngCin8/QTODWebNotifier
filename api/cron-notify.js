// Scheduled notification endpoint for Vercel Cron Jobs
// This endpoint sends daily notifications to all subscribers via VAPID push
// See: https://vercel.com/docs/cron-jobs

import webpush from 'web-push';
import { quotes, vapidKeys, dbConfig } from './_shared.js';
import { db } from './_database.js';

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

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const payload = JSON.stringify({
      title: 'Daily Quote',
      body: `"${randomQuote.text}" - ${randomQuote.author}`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });

    let subscriptions = [];
    let sentCount = 0;
    let errorCount = 0;

    // Try to get subscriptions from database if configured
    if (dbConfig.isConfigured) {
      try {
        subscriptions = await db.getAllSubscriptions();
        console.log(`Found ${subscriptions.length} subscriptions in database`);
      } catch (dbError) {
        console.error('Error fetching subscriptions from database:', dbError);
        // Continue without database subscriptions
      }
    }

    if (subscriptions.length === 0) {
      console.log('No subscriptions found - cron job completed without sending notifications');
      return res.status(200).json({ 
        success: true, 
        message: 'Daily notification cron job completed - no subscribers',
        timestamp: new Date().toISOString(),
        quote: randomQuote,
        sent: 0,
        errors: 0
      });
    }

    // Send notifications to all subscribers
    const promises = subscriptions.map(subscription => {
      return webpush.sendNotification(subscription, payload)
        .then(() => {
          sentCount++;
          return { success: true, subscription };
        })
        .catch(err => {
          console.error('Error sending notification:', err);
          errorCount++;
          
          // Remove invalid subscriptions from database if configured
          if (dbConfig.isConfigured && (err.statusCode === 410 || err.statusCode === 404)) {
            db.removeSubscription(subscription).catch(removeErr => {
              console.error('Error removing invalid subscription:', removeErr);
            });
          }
          
          return { error: err.message, subscription };
        });
    });

    const results = await Promise.allSettled(promises);
    
    console.log(`Cron job executed at: ${new Date().toISOString()}`);
    console.log(`Sent notifications to ${sentCount} subscribers, ${errorCount} errors`);

    res.status(200).json({ 
      success: true, 
      message: errorCount > 0 ? 'Daily notification cron job completed with some errors' : 'Daily notification cron job completed successfully',
      timestamp: new Date().toISOString(),
      quote: randomQuote,
      sent: sentCount,
      errors: errorCount,
      totalSubscriptions: subscriptions.length
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