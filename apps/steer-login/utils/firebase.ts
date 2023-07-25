import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut as firebaseSignOut,
  signInWithPopup,
  type Auth
} from 'firebase/auth';

const firebaseConfigSteer = {
    apiKey: "AIzaSyCiBLG8uuum5aLfphODrcEbfuO3ISGiI4E",
    authDomain: "steer-bb667.firebaseapp.com",
    projectId: "steer-bb667",
    storageBucket: "steer-bb667.appspot.com",
    messagingSenderId: "59558391",
    appId: "1:59558391:web:07d10d19d9a362c080c6f2",
    measurementId: "G-GDRTRENV12"
  };

const firebaseConfigSteerCode = {
  apiKey: 'AIzaSyA3VgNr69e4zL5UtozZRrztVYnLdN1TR4s',
  authDomain: 'cognitic-dbea8.firebaseapp.com',
  projectId: 'cognitic-dbea8',
  storageBucket: 'cognitic-dbea8.appspot.com',
  messagingSenderId: '469757089999',
  appId: '1:469757089999:web:fb50eead404266407bbfba'
};

const appSteer = initializeApp(firebaseConfigSteer, 'steer');
const appSteerCode = initializeApp(firebaseConfigSteerCode, 'steercode');

// Initialize Firebase Authentication and get a reference to the service
const authSteer = getAuth(appSteer);
const authSteerCode = getAuth(appSteerCode);

export function getAuthForProtocol(protocol: string) {
  switch (protocol) {
    case 'steer':
      return authSteer;
    case 'steercode':
      return authSteerCode;
    default:
      return authSteer;
  }
}


export function signOut(auth: Auth) {
  return firebaseSignOut(auth);
}

export function loginGoogle(auth: Auth) {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.debug('SignIn Google', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Google', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

export function loginGitHub(auth: Auth) {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      console.debug('SignIn Github', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Github', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

export function loginTwitter(auth: Auth) {
  const provider = new TwitterAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Twitter Access Token. You can use it to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      console.debug('SignIn Twitter', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Twitter', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

