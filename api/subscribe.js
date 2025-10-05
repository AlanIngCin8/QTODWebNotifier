export default function handler(req, res) {
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
    
    // In serverless environment, we can't store subscriptions in memory
    // For a production app, you would store this in a database like:
    // - Vercel KV
    // - Supabase
    // - MongoDB Atlas
    // - Planetscale
    // etc.
    
    console.log('New subscription received:', subscription);
    
    // For now, just acknowledge the subscription
    // In a real app, save this to your database
    res.status(200).json({ 
      success: true, 
      message: 'Subscription received. Note: Implement database storage for production.' 
    });
  } catch (error) {
    console.error('Error handling subscription:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
}