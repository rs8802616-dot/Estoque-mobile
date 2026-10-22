import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  memoryLocalCache,
  memoryLruGarbageCollector,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { limparArmazenamentoLocalCorrompido } from './safeStorage';

// Limpa preventivamente quaisquer mutações e estados de abas zumbis residuais no localStorage
limparArmazenamentoLocalCorrompido();

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: memoryLocalCache({
        garbageCollector: memoryLruGarbageCollector(),
      }),
    },
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined
  );
} catch (e) {
  firestoreInstance =
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
}

// Export safe Firestore instance with memory cache
export const db = firestoreInstance;

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Assegura que o cliente web possua uma credencial Firebase Auth ativa (request.auth != null)
try {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((authErr) => {
        // Se provedor anônimo ainda não estiver habilitado no console do Firebase, registra aviso sem travar a aplicação offline
        console.info('Firebase Auth: Sessão local inicializada. Para ativar autenticação estrita no Firebase Console, habilite o provedor Anonymous ou Email/Senha.');
      });
    }
  });
} catch (err) {
  console.warn('Aviso na inicialização do Firebase Auth:', err);
}

export default app;
