
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwtvR74yFwX7mwLLnJTORgmMYER2yg5DY",
  authDomain: "data-base-a8a67.firebaseapp.com",
  projectId: "data-base-a8a67",
  storageBucket: "data-base-a8a67.firebasestorage.app",
  messagingSenderId: "582753786800",
  appId: "1:582753786800:web:f5d7fe09ec7b7aaded1475",
  measurementId: "G-3LWZCPEFDS"
};

// FIX: Removed unnecessary explicit FirebaseApp type which was causing an import error.
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
