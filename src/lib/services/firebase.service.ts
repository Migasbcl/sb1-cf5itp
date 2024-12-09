import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

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

// Initialize Auth and Storage
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firestore with persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({
      forceOwnership: true
    })
  })
});

// Collection names
export const collections = {
  users: 'users',
  organizations: 'organizations',
  events: 'events',
  teams: 'teams',
  guests: 'guests'
} as const;

let isInitialized = false;

export async function initializeFirebase() {
  if (isInitialized) return;
  
  try {
    // Monitor connection state
    window.addEventListener('online', () => {
      validateFirebaseConnection().then(isConnected => {
        if (isConnected) {
          toast({
            title: "Conexão restaurada",
            description: "Sua conexão com o servidor foi restabelecida.",
          });
        }
      });
    });

    window.addEventListener('offline', () => {
      toast({
        title: "Sem conexão",
        description: "Modo offline ativado. Alterações serão sincronizadas quando houver conexão.",
        duration: 5000,
      });
    });

    // Initial connection check
    await validateFirebaseConnection();
    
    isInitialized = true;
    console.log('Firebase inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    throw error;
  }
}

export async function validateFirebaseConnection(): Promise<boolean> {
  if (!navigator.onLine) return false;

  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const testQuery = await Promise.race([
      db.terminate(),
      timeout
    ]);

    await db.enableNetwork();
    return true;
  } catch (error) {
    console.warn('Falha na validação da conexão:', error);
    return false;
  }
}