import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/types/event.types";
import { addGuest } from "@/lib/services/guest.service";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const guestSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

type GuestFormValues = z.infer<typeof guestSchema>;

interface EventLandingPageProps {
  event: Event;
  onGuestAdded: () => void;
}

export function EventLandingPage({ event, onGuestAdded }: EventLandingPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(data: GuestFormValues) {
    setIsLoading(true);
    try {
      await addGuest(event.id, data);
      
      toast({
        title: "Sucesso!",
        description: "Sua presença foi confirmada.",
      });

      form.reset();
      onGuestAdded();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível confirmar sua presença.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-bold text-center">{event.name}</DialogTitle>
      </DialogHeader>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Details */}
        <div className="space-y-4">
          {/* Event Image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(event.date, "PPP", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{format(event.date, "HH:mm")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>{event.guestCount} Guests</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Sobre o Evento</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Confirmar Presença</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Confirmando..." : "Confirmar Presença"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}