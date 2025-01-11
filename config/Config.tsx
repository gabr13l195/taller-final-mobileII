// config/Config.tsx

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Nueva configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCx6ZGVMxDBHP2UpyURAJiqO5o-DiytR1U",
    authDomain: "wb-prueba.firebaseapp.com",
    projectId: "wb-prueba",
    storageBucket: "wb-prueba.firebasestorage.app",
    messagingSenderId: "29586165432",
    appId: "1:29586165432:web:c7e1341cf14e192521ee4d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios de Firebase
export const auth = getAuth(app);
export const db = getDatabase(app);
