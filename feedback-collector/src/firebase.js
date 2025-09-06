import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ,
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);


export const auth = getAuth(app);


export const ensureAnonAuth = () =>
  new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) return resolve(user);
      try {
        const res = await signInAnonymously(auth);
        resolve(res.user);
      } catch (e) {
        reject(e);
      }
    });
  });

export const setupAppCheck = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_RECAPTCHA_V3_KEY) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_V3_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }
};
