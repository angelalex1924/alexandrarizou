import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: ReturnType<typeof getFirestore> | null = null;

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // Try to use service account credentials from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: 'alexandra-rizou'
      });
      adminDb = getFirestore();
    } else {
      // Use Application Default Credentials (works on Vercel/production)
      // For development, initialize with project ID
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'alexandra-rizou'
      });
      adminDb = getFirestore();
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    // If Admin SDK fails, we'll need to use client SDK with proper rules
    adminDb = null;
  }
} else {
  adminDb = getFirestore();
}

export { adminDb };

