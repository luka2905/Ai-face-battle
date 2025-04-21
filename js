import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "ai-face-battlee.firebaseapp.com",
  projectId: "ai-face-battlee",
  storageBucket: "ai-face-battlee.appspot.com",
  messagingSenderId: "963010838117",
  appId: "1:963010838117:web:b94913db1e545fcef2d08c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
