import * as firebase from 'firebase/app';
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

/*Originaly Google is not allow user to access cloud function from Localhost, inorder to use "CallCloudFunctionForOtherTags()" 
function from Summary Page, we can use local emulator instead.
Have to set up Firebase emulator then run "firebase emulators:start" or "firebase serve" command 
rebuild your project: "npm run build" in you root directory (everytime you have some changes in the code) 
before you run "firebase emulators:start" or "firebase serve" */

//Uncommon below code when you running you application locally.
//below set up is ONLY for Summary Page displaying other's tags

// if(window.location.hostname === 'localhost'){
//   console.log("this is localhost")
//   firebase.functions().useFunctionsEmulator('http://localhost:5001');
// }
export default app;