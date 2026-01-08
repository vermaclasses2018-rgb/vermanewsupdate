// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyDFZOn3g-ZP-J3Vb-QO2MfOLPqoo1av3kE",
  authDomain: "verma-news.firebaseapp.com",
  projectId: "verma-news",
  storageBucket: "verma-news.firebasestorage.app",
  messagingSenderId: "1079735577962",
  appId: "1:1079735577962:web:2310501ba8fa3906020913",
  measurementId: "G-6YMNZK3JLK",
  databaseURL: "https://verma-news-default-rtdb.firebaseio.com" // Add your database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other modules
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDatabase = database;
window.firebaseStorage = storage;
window.firebaseAnalytics = analytics;

console.log('Firebase initialized successfully');
