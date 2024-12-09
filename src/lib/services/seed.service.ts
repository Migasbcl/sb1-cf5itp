import { db, collections } from '../firebase';
import { collection, addDoc, serverTimestamp, runTransaction, doc } from 'firebase/firestore';
import { uploadEventImage } from './storage.service';

const TEST_EVENTS = [
  {
    name: "Festa de Inauguração",
    description: "Celebração especial de inauguração com música ao vivo e coquetel",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    date: new Date('2024-12-31'),
  },
  {
    name: "Show de Verão",
    description: "Grande show de verão com as melhores bandas da cidade",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    date: new Date('2024-12-25'),
  },
  {
    name: "Festival Gastronômico",
    description: "Experiência única com os melhores chefs da região",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033",
    date: new Date('2024-12-20'),
  }
];

export async function createTestEvents(organizationId: string) {
  console.log('Iniciando criação de eventos de teste...');
  
  try {
    const eventsRef = collection(db, collections.events);
    const orgRef = doc(db, collections.organizations, organizationId);
    
    for (const eventData of TEST_EVENTS) {
      await runTransaction(db, async (transaction) => {
        // Criar o evento
        const newEventRef = await addDoc(eventsRef, {
          ...eventData,
          organizationId,
          location: organizationId,
          status: 'active',
          guestCount: Math.floor(Math.random() * 100),
          createdAt: serverTimestamp()
        });

        // Atualizar contador de eventos ativos
        transaction.update(orgRef, {
          activeEventsCount: increment(1)
        });

        console.log('Evento criado:', newEventRef.id);
      });
    }

    console.log('Eventos de teste criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar eventos de teste:', error);
    throw new Error('Falha ao criar eventos de teste');
  }
}