import { supabase } from './supabase';

export async function getDashboardStats(userId: string) {
  if (!userId) {
    console.warn('ID do usuário não fornecido');
    return getEmptyStats();
  }

  try {
    // Primeiro, buscar o ID da organização do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', userId)
      .single();

    if (userError || !userData?.organization_id) {
      console.warn('Usuário sem organização:', userId);
      return getEmptyStats();
    }

    // Depois, buscar as estatísticas da organização
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select(`
        active_events_count,
        total_promoters,
        total_teams
      `)
      .eq('id', userData.organization_id)
      .single();

    if (orgError || !orgData) {
      console.error('Erro ao buscar dados da organização:', orgError);
      return getEmptyStats();
    }

    return {
      activeEvents: orgData.active_events_count || 0,
      totalPromoters: orgData.total_promoters || 0,
      totalTeams: orgData.total_teams || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return getEmptyStats();
  }
}

function getEmptyStats() {
  return {
    activeEvents: 0,
    totalPromoters: 0,
    totalTeams: 0,
  };
}