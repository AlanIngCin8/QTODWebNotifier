// Database connection utility for Vercel KV
// Supports both Redis connection string and REST API methods

import { dbConfig } from './_shared.js';

let redisClient = null;
let kv = null;

// Initialize the appropriate database connection
export async function initDatabase() {
  if (dbConfig.connectionMethod === 'redis') {
    // Use Redis connection string
    const { createClient } = await import('redis');
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
    return redisClient;
  } else if (dbConfig.connectionMethod === 'rest') {
    // Use REST API
    const { kv: vercelKv } = await import('@vercel/kv');
    kv = vercelKv;
    return kv;
  } else {
    throw new Error('No database configuration found. Please set REDIS_URL or KV_REST_API_URL/KV_REST_API_TOKEN');
  }
}

// Database operations wrapper
export const db = {
  // Store subscription
  async storeSubscription(subscription) {
    if (dbConfig.connectionMethod === 'redis') {
      if (!redisClient) await initDatabase();
      return await redisClient.lPush('subscriptions', JSON.stringify(subscription));
    } else if (dbConfig.connectionMethod === 'rest') {
      if (!kv) await initDatabase();
      return await kv.lpush('subscriptions', JSON.stringify(subscription));
    }
  },

  // Get all subscriptions
  async getAllSubscriptions() {
    if (dbConfig.connectionMethod === 'redis') {
      if (!redisClient) await initDatabase();
      const subscriptions = await redisClient.lRange('subscriptions', 0, -1);
      return subscriptions.map(sub => JSON.parse(sub));
    } else if (dbConfig.connectionMethod === 'rest') {
      if (!kv) await initDatabase();
      const subscriptions = await kv.lrange('subscriptions', 0, -1);
      return subscriptions.map(sub => JSON.parse(sub));
    }
    return [];
  },

  // Remove subscription
  async removeSubscription(subscription) {
    if (dbConfig.connectionMethod === 'redis') {
      if (!redisClient) await initDatabase();
      return await redisClient.lRem('subscriptions', 1, JSON.stringify(subscription));
    } else if (dbConfig.connectionMethod === 'rest') {
      if (!kv) await initDatabase();
      return await kv.lrem('subscriptions', 1, JSON.stringify(subscription));
    }
  },

  // Get subscription count
  async getSubscriptionCount() {
    if (dbConfig.connectionMethod === 'redis') {
      if (!redisClient) await initDatabase();
      return await redisClient.lLen('subscriptions');
    } else if (dbConfig.connectionMethod === 'rest') {
      if (!kv) await initDatabase();
      return await kv.llen('subscriptions');
    }
    return 0;
  },

  // Close connection
  async close() {
    if (redisClient) {
      await redisClient.disconnect();
      redisClient = null;
    }
    // REST API doesn't need explicit closing
  }
};