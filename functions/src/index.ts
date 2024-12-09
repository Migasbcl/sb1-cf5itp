import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const checkExpiredEvents = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      const snapshot = await db
        .collection('events')
        .where('status', '==', 'active')
        .where('date', '<', now)
        .get();

      const batch = db.batch();
      
      for (const doc of snapshot.docs) {
        const eventRef = db.collection('events').doc(doc.id);
        const eventData = doc.data();
        
        batch.update(eventRef, {
          status: 'finished',
          updatedAt: now
        });

        // Atualizar contador de eventos ativos da organização
        const orgRef = db.collection('organizations').doc(eventData.organizationId);
        batch.update(orgRef, {
          activeEventsCount: admin.firestore.FieldValue.increment(-1)
        });
      }

      await batch.commit();

      console.log(`${snapshot.size} eventos expirados foram atualizados`);
      return null;
    } catch (error) {
      console.error('Erro ao verificar eventos expirados:', error);
      return null;
    }
  });