import express from 'express';
import webpush from 'web-push';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// VAPID keys for push notifications (in production, these should be environment variables)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BG2kWa7qfyKuCAC_3BpNbEmsrSkfRhfPaOZcpuRvrpEQOPBIG-5VnxOoKAMk1guJtMhvdbEs0f9lOXrw-qvLk1Q',
  privateKey: process.env.VAPID_PRIVATE_KEY || '6C-VIrWqheG5Z3ruv-0QR0JF9c4Lwe7l3edRTpb85JU'
};

webpush.setVapidDetails(
  'mailto:test@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Famous quotes database
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

// Store subscriptions (in production, use a database)
let subscriptions = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/quote', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log('New subscription:', subscription);
  res.json({ success: true });
});

app.post('/api/send-notification', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const payload = JSON.stringify({
    title: 'Quote of the Day',
    body: `"${randomQuote.text}" - ${randomQuote.author}`,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png'
  });

  const promises = subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, payload)
      .catch(err => {
        console.error('Error sending notification:', err);
        // Remove invalid subscriptions
        const index = subscriptions.indexOf(subscription);
        if (index > -1) {
          subscriptions.splice(index, 1);
        }
      });
  });

  Promise.all(promises)
    .then(() => res.json({ success: true, quote: randomQuote }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Schedule daily notifications
setInterval(() => {
  if (subscriptions.length > 0) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const payload = JSON.stringify({
      title: 'Daily Quote',
      body: `"${randomQuote.text}" - ${randomQuote.author}`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });

    subscriptions.forEach(subscription => {
      webpush.sendNotification(subscription, payload)
        .catch(err => {
          console.error('Error sending daily notification:', err);
          // Remove invalid subscriptions
          const index = subscriptions.indexOf(subscription);
          if (index > -1) {
            subscriptions.splice(index, 1);
          }
        });
    });
    console.log('Sent daily notifications to', subscriptions.length, 'subscribers');
  }
}, 24 * 60 * 60 * 1000); // Every day

app.listen(port, () => {
  console.log(`QTOD Web Notifier server running at http://localhost:${port}`);
});