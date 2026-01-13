import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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