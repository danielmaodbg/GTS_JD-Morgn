import { db, auth, isConfigured, storage } from './firebase';
import { 
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { 
  collection, addDoc, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc, query, orderBy, limit, writeBatch,
  QueryDocumentSnapshot, DocumentData
} from "firebase/firestore";
import { 
  ref, uploadBytesResumable, getDownloadURL, StorageTaskSnapshot
} from "firebase/storage";
import { INITIAL_APP_CONFIG, INITIAL_SUBMISSIONS, MOCK_USERS } from './constants';
import { TradeSubmission, AppConfig, User, MemberType, HeroSlide } from './types';

const generateMemberId = (uid: string) => {
  return `JD-${uid.substring(0, 5).toUpperCase()}`;
};

export const dataService = {
  async ensureDb() { return isConfigured; },

  async ensureAuthenticated() {
    if (!isConfigured) return;
    if (!auth.currentUser) {
      try {
        await firebaseSignInAnonymously(auth);
      } catch (e: any) {
        if (e.code === 'auth/admin-restricted-operation') {
          console.error("CRITICAL: Anonymous Auth is DISABLED in Firebase Console.");
        }
        throw e;
      }
    }
  },

  async signInAnonymously() {
    if (!isConfigured) return;
    try {
      const cred = await firebaseSignInAnonymously(auth);
      return cred.user;
    } catch (e: any) {
      throw e;
    }
  },

  async uploadFile(file: File | Blob, path: string, onProgress?: (percent: number) => void): Promise<string> {
    if (!isConfigured) return URL.createObjectURL(file);
    await this.ensureAuthenticated();

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot: StorageTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        }, 
        (error: Error) => {
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  },

  async getSettings(): Promise<AppConfig> {
    if (!isConfigured) {
      const local = localStorage.getItem('jd_morgan_app_config');
      return local ? JSON.parse(local) : INITIAL_APP_CONFIG;
    }
    try {
      const docRef = doc(db, "settings", "app_config");
      const docSnap = await getDoc(docRef);
      let baseConfig = INITIAL_APP_CONFIG;
      if (docSnap.exists()) {
        baseConfig = { ...INITIAL_APP_CONFIG, ...docSnap.data() };
      }
      const slidesSnap = await getDocs(query(collection(db, "hero_slides"), orderBy("order", "asc")));
      const heroSlides = slidesSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), id: doc.id } as HeroSlide));
      if (heroSlides.length > 0) baseConfig.heroSlides = heroSlides;
      return baseConfig;
    } catch (e) {
      return INITIAL_APP_CONFIG;
    }
  },

  async saveSettings(config: AppConfig) {
    if (!isConfigured) return true;
    const batch = writeBatch(db);
    const { heroSlides, ...baseConfig } = config;
    batch.set(doc(db, "settings", "app_config"), baseConfig);
    for (const slide of heroSlides) {
      const slideRef = doc(db, "hero_slides", slide.id);
      batch.set(slideRef, slide);
    }
    await batch.commit();
    return true;
  },

  async deleteHeroSlide(slideId: string) {
    if (!isConfigured) return true;
    await deleteDoc(doc(db, "hero_slides", slideId));
    return true;
  },

  async submitTrade(data: any, file?: File, onProgress?: (p: number) => void) {
    if (!isConfigured) return true;
    let fileUrl = '';
    if (file) {
      const path = `submissions/${Date.now()}_${file.name}`;
      fileUrl = await this.uploadFile(file, path, onProgress);
    }
    const { ...rest } = data;
    await addDoc(collection(db, "submissions"), { 
      ...rest, 
      fileUrl, 
      status: 'Pending', 
      timestamp: new Date().toISOString() 
    });
    return true;
  },

  async registerAndVerify(userData: any, password: string) {
    if (!isConfigured) return true;
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;
    try { await sendEmailVerification(user); } catch (e) {}
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

  async signIn(email: string, password: string): Promise<User> {
    if (!isConfigured) return MOCK_USERS[0];
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    let userDoc = await getDoc(userDocRef);
    let userData = userDoc.data() as User;
    return { ...userData, uid: user.uid } as User;
  },

  async getAllUsers(): Promise<User[]> {
    if (!isConfigured) return MOCK_USERS;
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), uid: doc.id } as User));
  },

  async toggleUserApproval(userId: string, status: boolean) {
    if (!isConfigured) return true;
    await updateDoc(doc(db, "users", userId), { isApproved: status });
    return true;
  },

  async getSubmissions(limitCount: number = 20): Promise<TradeSubmission[]> {
    if (!isConfigured) return INITIAL_SUBMISSIONS;
    const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as TradeSubmission));
  },

  async deleteUser(userId: string) {
    if (!isConfigured) return true;
    await deleteDoc(doc(db, "users", userId));
    return true;
  },

  async deleteSubmission(submissionId: string) {
    if (!isConfigured) return true;
    await deleteDoc(doc(db, "submissions", submissionId));
    return true;
  },

  async updateUserRole(userId: string, newRole: MemberType) {
    if (!isConfigured) return true;
    await updateDoc(doc(db, "users", userId), { memberType: newRole });
    return true;
  },

  async runDiagnostic() {
    if (!isConfigured) return "SANDBOX";
    await this.ensureAuthenticated();
    const docRef = await addDoc(collection(db, "diagnostics"), {
      testTime: new Date().toISOString(),
      status: "HEALTHY"
    });
    return docRef.id;
  },

  async adminCreateUser(userData: any, password: string) {
    const userProfile = { ...userData, uid: 'admin_' + Date.now(), memberId: generateMemberId('admin'), createdAt: new Date().toISOString(), isApproved: true };
    await setDoc(doc(db, "users", userProfile.uid), userProfile);
    return userProfile;
  },

  async resendVerificationEmail() {
    if (!isConfigured) return true;
    await this.ensureAuthenticated();
    const user = auth.currentUser;
    if (!user) throw new Error("USER_NOT_LOGGED_IN");
    await sendEmailVerification(user);
    return true;
  }
};