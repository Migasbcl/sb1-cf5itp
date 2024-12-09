import { supabase } from '../supabase';

export async function addGuest(eventId: string, data: { name: string; email: string }) {
  try {
    // Verificar se o email já está registrado para este evento
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', data.email)
      .single();

    if (existingGuest) {
      throw new Error('Este email já está registrado para este evento.');
    }

    // Adicionar novo guest
    const { error: guestError } = await supabase
      .from('guests')
      .insert({
        event_id: eventId,
        name: data.name,
        email: data.email
      });

    if (guestError) throw guestError;

  } catch (error) {
    console.error('Error adding guest:', error);
    throw new Error(error instanceof Error ? error.message : 'Não foi possível confirmar sua presença. Tente novamente.');
  }
}

export async function getEventGuests(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw new Error('Não foi possível carregar a lista de convidados.');
  }
}