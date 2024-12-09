import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getEvents } from "@/lib/services/event.service";
import type { Event } from "@/lib/types/event.types";
import { Users, Loader2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { EventDetails } from "./EventDetails";
import { EventPreviewList } from "./EventPreviewList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EventLandingPage } from "../events/EventLandingPage";

interface EventListProps {
  organizationId: string;
}

export function EventList({ organizationId }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const loadEvents = async (lastId?: string) => {
    if (!organizationId) return;

    try {
      setLoadingMore(!!lastId);
      const { events: newEvents, lastEventId: newLastId } = await getEvents(organizationId, lastId);
      
      if (lastId) {
        setEvents(prev => [...prev, ...newEvents]);
      } else {
        setEvents(newEvents);
      }
      
      setLastEventId(newLastId);
      setHasMore(newEvents.length > 0);
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [organizationId]);

  const handleGuestAdded = () => {
    loadEvents();
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum evento ativo no momento.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{event.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{format(event.date, "PPP", { locale: ptBR })}</span>
                •
                <span>{event.location}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {event.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{event.guestCount} Guests</span>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Landing Page</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <EventLandingPage event={event} onGuestAdded={handleGuestAdded} />
                    </DialogContent>
                  </Dialog>
                  <EventDetails event={event} onEventUpdated={handleGuestAdded} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventPreviewList events={events} />

      {hasMore && lastEventId && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadEvents(lastEventId)}
            disabled={loadingMore}
          >
            {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Carregar mais eventos
          </Button>
        </div>
      )}
    </div>
  );
}