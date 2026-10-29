import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId per skill guidelines
const dbId = (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-a6485eac-5181-4c08-9412-5389756b9084';
export const db = getFirestore(app, dbId);
export const auth = getAuth(app);

// Connection validation test per skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore connection test passed.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client offline or Firestore config notice.');
    }
    return false;
  }
}
