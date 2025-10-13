import { dbConfig } from './_shared.js';
import { db } from './_database.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const subscription = req.body;
    
    console.log('New subscription received:', subscription);
    
    let message = 'Subscription received successfully.';
    
    // Store subscription in database if configured
    if (dbConfig.isConfigured) {
      try {
        await db.storeSubscription(subscription);
        const count = await db.getSubscriptionCount();
        message = `Subscription stored in database. Total subscribers: ${count}`;
        console.log(`Subscription stored. Total count: ${count}`);
      } catch (dbError) {
        console.error('Error storing subscription in database:', dbError);
        message = 'Subscription received but could not be stored in database.';
      }
    } else {
      message = 'Subscription received. Note: Database not configured - notifications will not work until database is set up.';
    }
    
    res.status(200).json({ 
      success: true, 
      message,
      subscription: {
        endpoint: subscription.endpoint,
        // Don't return the full keys for security, just indicate they exist
        hasKeys: !!(subscription.keys && subscription.keys.p256dh && subscription.keys.auth)
      }
    });
  } catch (error) {
    console.error('Error handling subscription:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
}