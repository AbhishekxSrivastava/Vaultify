import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDipYwGYR9JUyj8beLjXVogCdlsvDtW0Q",
  authDomain: "vaultify-app-b03c1.firebaseapp.com",
  projectId: "vaultify-app-b03c1",
  storageBucket: "vaultify-app-b03c1.firebasestorage.app",
  messagingSenderId: "301004291647",
  appId: "1:301004291647:web:76a8395100338e91fd428a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
