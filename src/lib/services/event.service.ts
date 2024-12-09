import { supabase } from '../supabase';
import type { Event, CreateEventData } from '../types/event.types';
import { uploadEventImage } from './storage.service';

const EVENTS_PER_PAGE = 10;

export async function createEvent(data: CreateEventData): Promise<string> {
  if (!data.organizationId) {
    throw new Error('ID da organização é obrigatório');
  }

  try {
    // Upload image first
    const imageFile = data.image[0];
    const imageUrl = await uploadEventImage(imageFile);

    // Create event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        name: data.name,
        description: data.description,
        location: data.location || data.organizationId,
        date: data.date.toISOString(),
        image_url: imageUrl,
        organization_id: data.organizationId,
        status: data.status,
        guest_count: data.guestCount,
      })
      .select()
      .single();

    if (eventError) throw eventError;
    if (!eventData) throw new Error('Failed to create event');

    // Update organization's active events count
    const { error: orgError } = await supabase.rpc('increment_active_events', {
      org_id: data.organizationId
    });

    if (orgError) throw orgError;

    return eventData.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(eventId: string, data: Partial<CreateEventData>): Promise<void> {
  try {
    const updates: any = {
      name: data.name,
      description: data.description,
      date: data.date?.toISOString(),
    };

    if (data.image?.[0]) {
      updates.image_url = await uploadEventImage(data.image[0]);
    }

    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function getEvents(organizationId: string, lastEventId?: string) {
  if (!organizationId) {
    throw new Error('ID da organização é obrigatório');
  }

  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(EVENTS_PER_PAGE);

    if (lastEventId) {
      const { data: lastEvent } = await supabase
        .from('events')
        .select('created_at')
        .eq('id', lastEventId)
        .single();

      if (lastEvent) {
        query = query.lt('created_at', lastEvent.created_at);
      }
    }

    const { data: events, error } = await query;

    if (error) throw error;

    return {
      events: events.map(event => ({
        ...event,
        id: event.id,
        date: new Date(event.date),
        createdAt: new Date(event.created_at),
        imageUrl: event.image_url,
        organizationId: event.organization_id,
        guestCount: event.guest_count
      })),
      lastEventId: events[events.length - 1]?.id
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}