import * as firebase from 'firebase/app';
//import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions'

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
});
// if(window.location.hostname === 'localhost'){
//   console.log("this is localhost")
//   firebase.functions().useFunctionsEmulator('http://localhost:5001');
// }
export default app;