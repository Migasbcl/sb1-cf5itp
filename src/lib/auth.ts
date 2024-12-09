import { supabase } from './supabase';
import type { User, Role } from './types';

export async function loginUser(email: string, password: string, role: Role): Promise<User> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('No user data returned');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error('User not found');
    if (userData.role !== role) throw new Error('Invalid role for this user');

    return {
      uid: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization: userData.organization_id,
      createdAt: new Date(userData.created_at).getTime(),
    };
  } catch (error: any) {
    throw new Error(getErrorMessage(error.message));
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  role: Role;
  organization?: string;
}): Promise<User> {
  try {
    // 1. Criar usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // 2. Se for organizador, criar organização
    let organizationId = null;
    if (data.role === 'organizer') {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          owner_id: authData.user.id,
        })
        .select()
        .single();

      if (orgError) throw orgError;
      if (!orgData) throw new Error('Failed to create organization');
      
      organizationId = orgData.id;
    }

    // 3. Criar registro do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.role,
        organization_id: organizationId,
      })
      .select()
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('Failed to create user');

    return {
      uid: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization: userData.organization_id,
      createdAt: new Date(userData.created_at).getTime(),
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getErrorMessage(error.message));
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

function getErrorMessage(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos';
  }
  if (message.includes('User already registered')) {
    return 'Este email já está em uso';
  }
  if (message.includes('Invalid email')) {
    return 'Email inválido';
  }
  return 'Ocorreu um erro. Por favor, tente novamente.';
}