import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJgwPDdBWmDUpvGOy3d5HW5Bij0sLHP1U",
  authDomain: "csci-5410-project-316112.firebaseapp.com",
  projectId: "csci-5410-project-316112",
  storageBucket: "csci-5410-project-316112.appspot.com",
  messagingSenderId: "950775920248",
  appId: "1:950775920248:web:a502eedd1537c187a45f8d",
  measurementId: "G-YQSRWDQP2P"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
