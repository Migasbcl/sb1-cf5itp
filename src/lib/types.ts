export interface User {
  uid: string;
  email: string;
  name: string;
  role: Role;
  organization?: string;
  createdAt: number;
}

export type Role = 'organizer' | 'promoter';