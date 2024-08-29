// src/components/firebase.d.ts
import { Auth, GoogleAuthProvider } from 'firebase/auth';

declare module './firebase' {
  export const auth: Auth;
  export const provider: GoogleAuthProvider;
  export const signInWithGoogle: () => Promise<void>;
  export const logOut: () => Promise<void>;
}
