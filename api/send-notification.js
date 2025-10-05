import webpush from 'web-push';
import { quotes, vapidKeys } from './_shared.js';

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
    // Configure webpush with VAPID details
    webpush.setVapidDetails(
      'mailto:test@example.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const payload = JSON.stringify({
      title: 'Quote of the Day',
      body: `"${randomQuote.text}" - ${randomQuote.author}`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });

    // In serverless environment, we need to get subscriptions from the request
    // or from a database. For demo purposes, we'll expect subscriptions in the request body
    const { subscriptions = [] } = req.body;

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(400).json({ 
        error: 'No subscriptions provided. In serverless mode, subscriptions must be passed in the request or stored in a database.' 
      });
    }

    const promises = subscriptions.map(subscription => {
      return webpush.sendNotification(subscription, payload)
        .catch(err => {
          console.error('Error sending notification:', err);
          return { error: err.message, subscription };
        });
    });

    const results = await Promise.allSettled(promises);
    const errors = results.filter(result => result.status === 'rejected' || result.value?.error);
    
    res.status(200).json({ 
      success: true, 
      quote: randomQuote,
      sent: subscriptions.length,
      errors: errors.length,
      message: errors.length > 0 ? 'Some notifications failed to send' : 'All notifications sent successfully'
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
}