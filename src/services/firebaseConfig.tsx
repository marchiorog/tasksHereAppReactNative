import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRVTbgYlc0opeut8x3tQIGyCF7cUI0JsE",
  authDomain: "tasksherereact.firebaseapp.com",
  projectId: "tasksherereact",
  storageBucket: "tasksherereact.firebasestorage.app",
  messagingSenderId: "386802466299",
  appId: "1:386802466299:web:bfcbb2856e95b7524f9f5e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = getFirestore(app);
export { db };