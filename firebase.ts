import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAy0r8GVkq72hqSUHd2QGN-Kc5691FZv7Q",
  authDomain: "jd-morgan-global-trading-1.firebaseapp.com",
  projectId: "jd-morgan-global-trading-1",
  storageBucket: "jd-morgan-global-trading-1.firebasestorage.app",
  messagingSenderId: "1087829011748",
  appId: "1:1087829011748:web:9af7490ca19612e92457b1",
  measurementId: "G-0DZTKNM06G"
};

export const isConfigured = true;
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const auth = getAuth(app);
export const storage = getStorage(app);