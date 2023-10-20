import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDatabase, ref, set, onValue, child, get, push, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDey_afwOQC6v9JNGFkg9OYE2JsbG0vf8k",
  authDomain: "learning-project01-f4de7.firebaseapp.com",
  projectId: "learning-project01-f4de7",
  storageBucket: "learning-project01-f4de7.appspot.com",
  messagingSenderId: "743228808650",
  appId: "1:743228808650:web:6c6236c2f8cb6f14abc333",
  measurementId: "G-XG8THYJ60H",
  databaseURL: "https://learning-project01-f4de7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// get the current user
const user = auth.currentUser;

// sign up the user
const signUpForm = document.getElementById("signUpForm");
signUpForm ? signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const signUp = await createUserWithEmailAndPassword(auth, signUpForm.email.value, signUpForm.password.value);
  console.log(signUp);
  console.log('logged in');
}) : "";


// sign in the user
const signInForm = document.getElementById("signInForm");
signInForm ? signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, signInForm.email.value, signInForm.password.value);
}) : "";

// change user's name
const nameForm = document.getElementById("nameForm");
nameForm ? nameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  updateProfile(user, { displayName: nameForm.name.value })
  console.log(user.displayName);
}) : "";


// create new message
const newMessageForm = document.getElementById("newMessageForm");
const db = getDatabase();

function addNewMs(name, message) {
  const msListRef = ref(db, 'messages')
  const newMsRef = push(msListRef)

  set(newMsRef, {
    name: name,
    message: message,
  });
}

newMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewMs(auth.currentUser.displayName, newMessageForm.message.value)
})


// onValue listener
const msRef = ref(db, 'messages/');
onValue(msRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = Object.values(snapshot.val());
    document.getElementById("messages").innerHTML = data.map((element) =>
      `<div class="message ${element.name == auth.currentUser.displayName ? "my" : ""}">
      <h3>${element.name}</h3>
      <p>${element.message}</p>
    </div>`).join(" ");
  } else {
    console.log("No data available");
  }

});

