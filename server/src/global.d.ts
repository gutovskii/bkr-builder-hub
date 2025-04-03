import type { UserPayload } from './auth/user.payload';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Extend Express Request
    }
  }
}

export {};
