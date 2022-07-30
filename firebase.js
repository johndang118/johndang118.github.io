const firebaseConfig = {
    apiKey: "AIzaSyBbP9_mF6ZKHq7e3MgXLKioOVhpUmNRDmc",
    authDomain: "tntthdfroster.firebaseapp.com",
    projectId: "tntthdfroster",
    storageBucket: "tntthdfroster.appspot.com",
    messagingSenderId: "544733424032",
    appId: "1:544733424032:web:71ce8f3d6fe673a3e1dcc5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();