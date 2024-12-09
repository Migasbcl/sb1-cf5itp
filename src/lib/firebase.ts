import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD39Ctcl9fSbNP6SqijfrFv3ZlhW0q38c0",
  authDomain: "guestlist-40fea.firebaseapp.com",
  projectId: "guestlist-40fea",
  storageBucket: "guestlist-40fea.appspot.com",
  messagingSenderId: "433264901408",
  appId: "1:433264901408:web:2ca9e40ddf8f37303a2b45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Collection names
export const collections = {
  users: 'users',
  organizations: 'organizations',
  events: 'events',
  teams: 'teams',
  guests: 'guests'
} as const;

// Initialize organization
export async function initializeOrganization(data: { id: string; name: string; ownerId: string }) {
  try {
    const orgRef = doc(db, collections.organizations, data.id);
    await setDoc(orgRef, {
      name: data.name,
      ownerId: data.ownerId,
      activeEventsCount: 0,
      totalPromoters: 0,
      totalTeams: 0,
      createdAt: new Date().getTime()
    });
  } catch (error) {
    console.error('Error initializing organization:', error);
    throw error;
  }
}