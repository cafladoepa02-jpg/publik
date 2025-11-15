
import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser | null;

export enum Page {
  Home = 'Home',
  Writings = 'Writings',
  Music = 'Music',
  Oracle = 'Oracle',
  Spellbook = 'Spellbook',
}

export interface Writing {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'Journal' | 'Story';
}

export interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}
