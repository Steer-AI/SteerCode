import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA3VgNr69e4zL5UtozZRrztVYnLdN1TR4s',
  authDomain: 'cognitic-dbea8.firebaseapp.com',
  projectId: 'cognitic-dbea8',
  storageBucket: 'cognitic-dbea8.appspot.com',
  messagingSenderId: '469757089999',
  appId: '1:469757089999:web:fb50eead404266407bbfba'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
