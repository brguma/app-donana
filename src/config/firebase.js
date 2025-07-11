import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// COLE AQUI SUA CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAy-o8I-ovYcx259VWXyHpULteTdB6y6KE",
  authDomain: "appdonana.firebaseapp.com",
  projectId: "appdonana",
  storageBucket: "appdonana.firebasestorage.app",
  messagingSenderId: "207446896560",
  appId: "1:207446896560:web:719d59ea3b047dc1cef075"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;