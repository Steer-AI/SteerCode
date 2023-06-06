import { auth } from '$lib/core/services/firebase';
import { Log } from '$lib/core/services/logging';
import {
  OAuthCredential,
  signOut as firebaseSignOut,
  signInWithCredential
} from 'firebase/auth';

export function signOut() {
  return firebaseSignOut(auth);
}

export function login(credValue: string, providerId: string) {
  const credential: OAuthCredential | null =
    OAuthCredential.fromJSON(credValue);
  Log.DEBUG('signInWithCredentials', credential);
  if (!credential) {
    return Promise.reject('Invalid credential');
  }
  return signInWithCredential(auth, credential);
}
