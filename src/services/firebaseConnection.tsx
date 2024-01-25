import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-aQuo3xLmV0XD003C-eJqZMVUxwQ8w6w",
  authDomain: "webcarros-ae0f2.firebaseapp.com",
  projectId: "webcarros-ae0f2",
  storageBucket: "webcarros-ae0f2.appspot.com",
  messagingSenderId: "214178241388",
  appId: "1:214178241388:web:08d968f58e46b789533149",
  measurementId: "G-DVZ9LXB2FM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage};