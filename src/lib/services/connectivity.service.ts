import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

let isOnline = true;
let isChecking = false;

export async function checkConnectivity(): Promise<boolean> {
  if (isChecking) return isOnline;
  
  isChecking = true;
  
  try {
    const testQuery = query(collection(db, 'users'), limit(1));
    await getDocs(testQuery);
    
    if (!isOnline) {
      isOnline = true;
      toast({
        title: "Conexão restaurada",
        description: "Sua conexão com o servidor foi restabelecida.",
      });
    }
    
    return true;
  } catch (error) {
    if (isOnline) {
      isOnline = false;
      toast({
        title: "Sem conexão",
        description: "Operando em modo offline. Suas alterações serão sincronizadas quando a conexão for restaurada.",
        duration: 5000,
      });
    }
    return false;
  } finally {
    isChecking = false;
  }
}

export function startConnectivityMonitoring() {
  window.addEventListener('online', checkConnectivity);
  window.addEventListener('offline', () => {
    isOnline = false;
    toast({
      title: "Sem conexão",
      description: "Você está offline. Suas alterações serão sincronizadas quando a conexão for restaurada.",
      duration: 5000,
    });
  });

  setInterval(checkConnectivity, 30000);
}