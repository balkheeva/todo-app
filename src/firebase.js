import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBApCwdJj3Cf4VIK1BVhmMuI85cikRmieA",
    authDomain: "todo-app-21efc.firebaseapp.com",
    projectId: "todo-app-21efc",
    storageBucket: "todo-app-21efc.appspot.com",
    messagingSenderId: "132642170419",
    appId: "1:132642170419:web:6f86233bfc4772f08ce546"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db }
