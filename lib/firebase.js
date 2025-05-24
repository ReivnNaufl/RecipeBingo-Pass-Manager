import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables for both apps
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || 
    !process.env.MAIN_FIREBASE_PRIVATE_KEY || !process.env.MAIN_FIREBASE_CLIENT_EMAIL) {
  throw new Error("Missing Firebase credentials in environment variables");
}

let keyAdmin;
let mainAdmin;

// Initialize keyAdmin app (only if not already initialized)
if (!admin.apps.some(app => app.name === 'keyAdmin')) {
  keyAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
    })
  }, 'keyAdmin'); // Give it a distinct name
}

// Initialize mainAdmin app (only if not already initialized)
if (!admin.apps.some(app => app.name === 'mainAdmin')) {
  mainAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.MAIN_FIREBASE_TYPE,
      project_id: process.env.MAIN_FIREBASE_PROJECT_ID,
      private_key_id: process.env.MAIN_FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.MAIN_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.MAIN_FIREBASE_CLIENT_EMAIL,
      client_id: process.env.MAIN_FIREBASE_CLIENT_ID,
    })
  }, 'mainAdmin'); // Give it a distinct name
}

// Get Firestore instances for each app
const keyDb = keyAdmin.firestore();
const mainDb = mainAdmin.firestore();

// Collections
const keysCollection = keyDb.collection('keys');

export { keyDb, mainDb, keysCollection, mainAdmin };