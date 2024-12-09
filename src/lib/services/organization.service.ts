import { db, collections } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getOrganization(organizationId: string) {
  if (!organizationId) {
    throw new Error('ID da organização é obrigatório');
  }

  try {
    const orgDoc = await getDoc(doc(db, collections.organizations, organizationId));
    
    if (!orgDoc.exists()) {
      throw new Error('Organização não encontrada');
    }
    
    return {
      id: orgDoc.id,
      ...orgDoc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar organização:', error);
    throw error;
  }
}

export async function initializeOrganization(data: { 
  id: string; 
  name: string; 
  ownerId: string; 
}) {
  try {
    const orgRef = doc(db, collections.organizations, data.id);
    
    // Verificar se a organização já existe
    const orgDoc = await getDoc(orgRef);
    if (orgDoc.exists()) {
      return;
    }

    // Criar nova organização
    await setDoc(orgRef, {
      name: data.name,
      ownerId: data.ownerId,
      activeEventsCount: 0,
      totalPromoters: 0,
      totalTeams: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Organização inicializada com sucesso:', data.id);
  } catch (error) {
    console.error('Erro ao inicializar organização:', error);
    throw error;
  }
}