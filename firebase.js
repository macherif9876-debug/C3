import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyATmlK18Lvonse2soeqTafz2GEb3a38Dmk",
  authDomain: "cherif-cr.firebaseapp.com",
  projectId: "cherif-cr",
  storageBucket: "cherif-cr.firebasestorage.app",
  messagingSenderId: "301481579113",
  appId: "1:301481579113:web:e8fbc737fa00a7c01908f8",
  measurementId: "G-TC8XWPTYRG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

// Gérer l'inscription
const signupForm = document.querySelector('form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Compte créé avec succès :", user);
                alert("Votre compte a été créé avec succès !");
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Erreur lors de la création du compte :", errorMessage);
                alert("Erreur: " + errorMessage);
            });
    });
}

// Gérer la connexion
const loginForm = document.querySelector('form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Connexion réussie :", user);
                alert("Connexion réussie !");
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Erreur de connexion :", errorMessage);
                alert("Erreur: " + errorMessage);
            });
    });
}

// Gérer la déconnexion
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error("Erreur de déconnexion:", error);
            });
    });
}
