import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAg4ZqTygFj95NIzQqTAF5aDefWaZOfx0E",
  authDomain: "permaculture-11e17.firebaseapp.com",
  databaseURL: "https://permaculture-11e17-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "permaculture-11e17",
  storageBucket: "permaculture-11e17.firebasestorage.app",
  messagingSenderId: "900470787857",
  appId: "1:900470787857:web:98d8e87a1ce28c7e5846b0",
  measurementId: "G-R9X9B1GVW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;