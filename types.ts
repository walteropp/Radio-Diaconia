
export interface SongMetadata {
  title: string;
  artist: string;
  album?: string;
  art?: string;
}

export interface RadioStatus {
  isLive: boolean;
  listeners: number;
  nowPlaying: SongMetadata;
}

export interface Prayer {
  id: string;
  text: string;
  category: 'Gratitud' | 'Petición' | 'Sanación' | 'Paz';
  timestamp: Date;
}

export enum AppTab {
  Radio = 'radio',
  Prayers = 'prayers',
  Chat = 'chat',
  Schedule = 'schedule'
}
