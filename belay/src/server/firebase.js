import firebase from 'firebase'

import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyAdce2pb_KkgiECApo_s97UB1aUaqjdRqs",
    authDomain: "slack-react-clone-yuyu.firebaseapp.com",
    projectId: "slack-react-clone-yuyu",
    storageBucket: "slack-react-clone-yuyu.appspot.com",
    messagingSenderId: "1094322446793",
    appId: "1:1094322446793:web:532ddffd6730158e14c818",
    measurementId: "G-J3B8D97TP5"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase