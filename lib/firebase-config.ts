import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0HODOA0RpsY0nM-UiefwUvqSD4DHe9DA",
  authDomain: "bananacare-23e20.firebaseapp.com",
  projectId: "bananacare-23e20",
  storageBucket: "bananacare-23e20.firebasestorage.app",
  messagingSenderId: "364390728571",
  appId: "1:364390728571:web:5b0b255843242bc91eb3de",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
