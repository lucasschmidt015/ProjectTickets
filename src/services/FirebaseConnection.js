import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage'

let firebaseConfig = {
    apiKey: "AIzaSyCIniXo-x7aqoviBftDq3e3oFLxklXoZYc",
    authDomain: "sistema-16087.firebaseapp.com",
    projectId: "sistema-16087",
    storageBucket: "sistema-16087.appspot.com",
    messagingSenderId: "383547674969",
    appId: "1:383547674969:web:50f29ddd805815e4f53c48",
    measurementId: "G-MHQ090MRBG"
  };
  
  if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);


export default firebase;
    