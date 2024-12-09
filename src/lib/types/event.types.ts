import { DocumentData } from 'firebase/firestore';

export interface CreateEventData {
  name: string;
  description: string;
  location: string;
  date: Date;
  image: FileList;
  organizationId: string;
  status: EventStatus;
  guestCount: number;
}

export type EventStatus = 'active' | 'finished' | 'cancelled';

export interface Event extends DocumentData {
  id: string;
  name: string;
  description: string;
  location: string;
  date: Date;
  imageUrl: string;
  organizationId: string;
  status: EventStatus;
  guestCount: number;
  createdAt: Date;
}