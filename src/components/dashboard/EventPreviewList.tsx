import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import type { Event } from "@/lib/types/event.types";

interface EventPreviewListProps {
  events: Event[];
}

export function EventPreviewList({ events }: EventPreviewListProps) {
  if (events.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Eventos Ativos</h3>
      <div className="bg-white rounded-lg shadow divide-y">
        {events.map((event) => (
          <div key={event.id} className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium">{event.name}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(event.date, "d 'de' MMMM", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(event.date, "HH:mm")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}