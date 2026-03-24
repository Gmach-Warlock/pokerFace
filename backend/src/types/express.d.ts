export interface IUser {
  id: string;
  username: string;
  email: string;
  password?: string;

  currency: number;
  level: number;
  xp: number;
  activeDeckId: string;
  unlockedDecks: string[];

  createdAt: Date;
  lastLogin: Date;
}
