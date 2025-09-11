export interface SessionUser {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  profilePictureUrl?: string | null;
}

export interface Session {
  user: SessionUser;
  expires: string | Date;
}