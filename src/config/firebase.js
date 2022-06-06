import firebase from 'firebase';
var firebaseConfig = {};
var mode = "test";

if(mode == "test") {
 firebaseConfig = {
    apiKey: "AIzaSyBcdBby9T950y1x57N1Pfg0_UMOv82xwSs",
    authDomain: "uzifytest-33c07.firebaseapp.com",
    projectId: "uzifytest-33c07",
    storageBucket: "uzifytest-33c07.appspot.com",
    messagingSenderId: "561938980462",
    appId: "1:561938980462:web:43d0a8e2dc79a50473107f",
    measurementId: "G-RZ0GMDLSB2"
  };
}else {
  firebaseConfig = {
    apiKey: "AIzaSyCqSIScjPsUS2pdT0hF2Ry0uSw1OE1ikoI",
    authDomain: "uzify-salonathome.firebaseapp.com",
    projectId: "uzify-salonathome",
    storageBucket: "uzify-salonathome.appspot.com",
    messagingSenderId: "885024916491",
    appId: "1:885024916491:web:80ab56ccd0987af350730e",
    measurementId: "G-4CN44DKPQ9"
  };
}
  const firebaseApp =  firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  


  
  export {firebaseApp};
  export default db;