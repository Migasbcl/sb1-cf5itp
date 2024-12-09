import { FirebaseError } from 'firebase/app';

export function handleFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return 'Você não tem permissão para realizar esta operação';
      case 'unavailable':
        return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes';
      case 'failed-precondition':
        return 'Operação não permitida no momento. Verifique sua conexão';
      case 'not-found':
        return 'O recurso solicitado não foi encontrado';
      case 'cancelled':
        return 'Operação cancelada';
      case 'data-loss':
        return 'Dados corrompidos. Por favor, tente novamente';
      case 'deadline-exceeded':
        return 'Tempo limite excedido. Verifique sua conexão';
      case 'already-exists':
        return 'Este recurso já existe';
      case 'resource-exhausted':
        return 'Limite de recursos excedido. Tente novamente mais tarde';
      default:
        console.error('Erro Firebase não tratado:', error);
        return 'Ocorreu um erro. Por favor, tente novamente';
    }
  }
  
  if (error instanceof Error) {
    console.error('Erro não Firebase:', error);
    return error.message;
  }

  console.error('Erro desconhecido:', error);
  return 'Ocorreu um erro inesperado';
}