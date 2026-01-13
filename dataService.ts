import { db, auth, isConfigured, firebaseConfig } from './firebase';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit,
  writeBatch,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { INITIAL_APP_CONFIG, INITIAL_SUBMISSIONS, MOCK_USERS } from './constants';
import { TradeSubmission, AppConfig, User, MemberType } from './types';

const generateMemberId = (uid: string) => {
  return `JD-${uid.substring(0, 5).toUpperCase()}`;
};

export const dataService = {
  async ensureDb() {
    return isConfigured;
  },

  async initializeAdmin() {
    if (!isConfigured) return "SANDBOX_MODE";
    const adminEmail = "info@jdmorgan.ca";
    const adminPass = "123456";
    try {
      let uid = "";
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        uid = userCredential.user.uid;
        await sendEmailVerification(userCredential.user);
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          const loginRes = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
          uid = loginRes.user.uid;
        } else {
          throw authErr;
        }
      }
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        memberId: generateMemberId(uid), 
        username: adminEmail,
        email: adminEmail,
        name: "JD Morgan Admin",
        role: "admin",
        memberType: MemberType.PROJECT_MANAGER,
        country: "Canada",
        createdAt: new Date().toISOString(),
        isApproved: true
      }, { merge: true });
      return uid;
    } catch (error) {
      console.error("Admin initialization failed:", error);
      throw error;
    }
  },

  async getSettings(): Promise<AppConfig> {
    if (!isConfigured) {
      const local = localStorage.getItem('jd_morgan_app_config');
      return local ? JSON.parse(local) : INITIAL_APP_CONFIG;
    }
    try {
      const docRef = doc(db, "settings", "app_config");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as AppConfig;
        return {
          ...INITIAL_APP_CONFIG,
          ...data,
          heroSlides: Array.isArray(data.heroSlides) ? data.heroSlides : INITIAL_APP_CONFIG.heroSlides
        };
      }
      return INITIAL_APP_CONFIG;
    } catch (e) {
      console.error("Fetch settings failed, using initial:", e);
      return INITIAL_APP_CONFIG;
    }
  },

  async saveSettings(config: AppConfig) {
    if (!isConfigured) {
      localStorage.setItem('jd_morgan_app_config', JSON.stringify(config));
      return true;
    }
    await setDoc(doc(db, "settings", "app_config"), config);
    return true;
  },

  async registerAndVerify(userData: any, password: string) {
    if (!isConfigured) return true;
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;
    try {
      await sendEmailVerification(user);
    } catch (e: any) {}
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      uid: user.uid,
      memberId: generateMemberId(user.uid), 
      createdAt: new Date().toISOString(),
      memberType: MemberType.REGULAR,
      isApproved: false 
    });
    return true;
  },

  async adminCreateUser(userData: any, password: string) {
    if (!isConfigured) return { ...userData, uid: 'mock_' + Date.now(), memberId: 'JD-MOCK' };
    const tempAppName = "temp_creation_app_" + Date.now();
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);

    try {
      const userCredential = await createUserWithEmailAndPassword(tempAuth, userData.email, password);
      const user = userCredential.user;
      const userProfile = {
        ...userData,
        uid: user.uid,
        memberId: generateMemberId(user.uid),
        createdAt: new Date().toISOString(),
        isApproved: true,
        memberType: userData.memberType || MemberType.REGULAR
      };
      await setDoc(doc(db, "users", user.uid), userProfile);
      return userProfile;
    } finally {
      await tempApp.delete();
    }
  },

  async resendVerificationEmail() {
    if (!isConfigured) return true;
    const user = auth.currentUser;
    if (!user) throw new Error("USER_NOT_LOGGED_IN");
    await sendEmailVerification(user);
    return true;
  },

  async signIn(email: string, password: string): Promise<User> {
    if (!isConfigured) {
      const mock = MOCK_USERS.find(u => u.username.toLowerCase() === email.toLowerCase() || (u.email || '').toLowerCase() === email.toLowerCase());
      if (mock && password === '123456') return mock;
      throw new Error("INVALID_CREDENTIALS");
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("USER_NOT_FOUND");
    let userData = userDoc.data() as User;
    if (user.emailVerified && !userData.isApproved) {
      await updateDoc(userDocRef, { isApproved: true });
      userData.isApproved = true;
    }
    if (!user.emailVerified && email !== "info@jdmorgan.ca" && !userData?.isApproved) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }
    return { ...userData, uid: user.uid } as User;
  },

  async getAllUsers(): Promise<User[]> {
    if (!isConfigured) return MOCK_USERS;
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, uid: doc.id } as User;
    });
  },

  async purgeUnverifiedUsers(onProgress?: (msg: string) => void, forceAll: boolean = false) {
    if (!isConfigured) return true;
    try {
      if (onProgress) onProgress(forceAll ? "🛡️ [ACTION] 正在強制清理所有待驗證會員..." : "🧹 [AUTO] 正在執行自動過期會員數據維護 (限1小時)...");
      
      const querySnapshot = await getDocs(collection(db, "users"));
      const batch = writeBatch(db);
      const now = new Date().getTime();
      const ONE_HOUR = 60 * 60 * 1000;
      let count = 0;

      querySnapshot.forEach((userDoc) => {
        const data = userDoc.data();
        const isAdmin = (data.email || '').toLowerCase() === "info@jdmorgan.ca";
        
        // 僅處理非管理員且未核准（待驗證）的用戶
        if (!isAdmin && data.isApproved === false) {
          const createdAt = data.createdAt ? new Date(data.createdAt).getTime() : 0;
          const isExpired = (now - createdAt) > ONE_HOUR;

          if (forceAll || isExpired) {
            batch.delete(userDoc.ref);
            count++;
          }
        }
      });

      if (count > 0) {
        await batch.commit();
        if (onProgress) onProgress(`✨ [SUCCESS] 已成功移除 ${count} 筆${forceAll ? '待驗證' : '已過期'}會員數據。`);
      } else {
        if (onProgress) onProgress("✅ [INFO] 沒有發現符合刪除條件的異常會員數據。");
      }
      return true;
    } catch (err: any) {
      if (onProgress) onProgress(`❌ [ERROR] 清理失敗: ${err.message}`);
      throw err;
    }
  },

  async toggleUserApproval(userId: string, status: boolean) {
    if (!isConfigured || !userId) return true;
    await updateDoc(doc(db, "users", userId), { isApproved: status });
    return true;
  },

  async getSubmissions(limitCount: number = 20): Promise<TradeSubmission[]> {
    if (!isConfigured) return INITIAL_SUBMISSIONS;
    const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TradeSubmission));
  },

  async submitTrade(data: any) {
    if (!isConfigured) return true;
    await addDoc(collection(db, "submissions"), {
      ...data,
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
    return true;
  },

  async deleteUser(userId: string) {
    if (!isConfigured || !userId) return true;
    await deleteDoc(doc(db, "users", userId));
    return true;
  },

  async deleteSubmission(submissionId: string) {
    if (!isConfigured || !submissionId) return true;
    await deleteDoc(doc(db, "submissions", submissionId));
    return true;
  },

  async purgeAllSubmissions(onProgress?: (msg: string) => void) {
    if (!isConfigured) return true;
    try {
      if (onProgress) onProgress("🔍 [SCAN] 掃描全球節點交易存根...");
      const snapshot = await getDocs(collection(db, "submissions"));
      const batch = writeBatch(db);
      let count = 0;
      snapshot.docs.forEach(d => {
        batch.delete(d.ref);
        count++;
      });
      if (count > 0) {
        if (onProgress) onProgress(`🧨 [PURGE] 發現 ${count} 筆意向數據，啟動批次物理銷毀...`);
        await batch.commit();
        if (onProgress) onProgress("✨ [SUCCESS] 交易申請數據已重置為零。");
      } else {
        if (onProgress) onProgress("✅ [INFO] 節點本已處於純淨狀態，無須清理。");
      }
      return true;
    } catch (err: any) {
      if (onProgress) onProgress(`❌ [ERROR] 清理失敗: ${err.message}`);
      throw err;
    }
  },

  async purgeDiagnostics(onProgress?: (msg: string) => void) {
    if (!isConfigured) return true;
    const snapshot = await getDocs(collection(db, "diagnostics"));
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    return true;
  },

  async purgeNonAdminUsers(onProgress?: (msg: string) => void) {
    if (!isConfigured) return true;
    const adminEmail = "info@jdmorgan.ca".toLowerCase().trim();
    try {
      if (onProgress) onProgress("🔍 [SCAN] 正在拉取雲端會員全量清冊...");
      const allUsers = await this.getAllUsers();
      const batch = writeBatch(db);
      let deleteCount = 0;

      allUsers.forEach(user => {
        const uEmail = (user.email || user.username || '').toLowerCase().trim();
        if (uEmail !== adminEmail) {
          const docRef = doc(db, "users", user.uid!);
          batch.delete(docRef);
          deleteCount++;
        }
      });

      if (deleteCount > 0) {
        if (onProgress) onProgress(`🧨 [PURGE] 識別到 ${deleteCount} 名非管理員會員，啟動批次移除...`);
        await batch.commit();
        if (onProgress) onProgress("✨ [SUCCESS] 會員矩陣重置成功，非管理員檔案已全數移除。");
      } else {
        if (onProgress) onProgress("✅ [INFO] 目前無任何非管理員會員紀錄。");
      }
      return true;
    } catch (err: any) {
      if (onProgress) onProgress(`❌ [ERROR] 會員重置失敗: ${err.message}`);
      throw err;
    }
  },

  async updateUserRole(userId: string, newRole: MemberType) {
    if (!isConfigured || !userId) return true;
    await updateDoc(doc(db, "users", userId), { memberType: newRole });
    return true;
  },

  async runDiagnostic() {
    if (!isConfigured) return "SANDBOX-DIAG-" + Date.now();
    const docRef = await addDoc(collection(db, "diagnostics"), {
      testTime: new Date().toISOString(),
      platform: "JD Morgan Terminal V2",
      status: "HEALTHY"
    });
    return docRef.id;
  }
};