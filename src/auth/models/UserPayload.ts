export interface UserPayload {
  sub: string;
  id: string;
  email: string;
  username: string;
  name: string;
  iat?: number;
  exp?: number;
}
