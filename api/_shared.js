// Shared quotes database for all API endpoints
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" }
];

// VAPID keys configuration for push notifications
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BG2kWa7qfyKuCAC_3BpNbEmsrSkfRhfPaOZcpuRvrpEQOPBIG-5VnxOoKAMk1guJtMhvdbEs0f9lOXrw-qvLk1Q',
  privateKey: process.env.VAPID_PRIVATE_KEY || '6C-VIrWqheG5Z3ruv-0QR0JF9c4Lwe7l3edRTpb85JU'
};

// Database configuration for Vercel KV
const dbConfig = {
  // KV connection will be automatically configured when @vercel/kv is used
  // Environment variables needed:
  // - KV_REST_API_URL: Your Vercel KV REST API endpoint
  // - KV_REST_API_TOKEN: Your Vercel KV authentication token
  isConfigured: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
};

export { quotes, vapidKeys, dbConfig };