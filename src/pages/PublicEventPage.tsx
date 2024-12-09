import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { EventLandingPage } from "@/components/events/EventLandingPage";
import { PartyPopper } from "lucide-react";
import type { Event } from "@/lib/types/event.types";

export function PublicEventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Evento não encontrado');

        setEvent({
          ...data,
          id: data.id,
          date: new Date(data.date),
          createdAt: new Date(data.created_at),
          imageUrl: data.image_url,
          organizationId: data.organization_id,
          guestCount: data.guest_count
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Evento não encontrado ou indisponível');
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PartyPopper className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ops!</h1>
          <p className="text-muted-foreground">{error || 'Evento não encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <EventLandingPage 
        event={event} 
        onGuestAdded={() => {
          // Recarregar dados do evento para atualizar contagem de guests
          window.location.reload();
        }} 
      />
    </div>
  );
}