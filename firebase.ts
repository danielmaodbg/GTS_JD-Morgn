import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * 請將下方的 "YOUR_..." 替換為您在 Firebase Console 取得的真實金鑰
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAy0r8GVkq72hqSUHd2QGN-Kc5691FZv7Q",
  authDomain: "jd-morgan-global-trading-1.firebaseapp.com",
  projectId: "jd-morgan-global-trading-1",
  storageBucket: "jd-morgan-global-trading-1.firebasestorage.app",
  messagingSenderId: "1087829011748",
  appId: "1:1087829011748:web:9af7490ca19612e92457b1",
  measurementId: "G-0DZTKNM06G"
};

// 設為 true，系統將會切換到真實 Firebase 模式
export const isConfigured = true;

// 初始化實例
export const app = initializeApp(firebaseConfig);

// 修復連線問題：啟用 experimentalForceLongPolling 解決 10s Timeout 報錯
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);