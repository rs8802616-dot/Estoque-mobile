import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  memoryLruGarbageCollector,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
} from 'firebase/app-check';
import firebaseConfig from '../../firebase-applet-config.json';
import { limparArmazenamentoLocalCorrompido } from './safeStorage';

// Limpa preventivamente quaisquer mutações e estados de abas zumbis residuais no localStorage
limparArmazenamentoLocalCorrompido();

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firestoreInstance: Firestore;
try {
  // Ativa cache persistente em disco (IndexedDB) compartilhado entre abas,
  // mantendo economia de leituras no F5 e evitando re-downloads ao abrir novas abas.
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined
  );
} catch (e) {
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
  } catch (errFallback) {
    firestoreInstance =
      firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
        ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
        : getFirestore(app);
  }
}

// Export safe Firestore instance with persistent multi-tab cache
export const db = firestoreInstance;

// Initialize Firebase Auth (Custom Token emitido pelo servidor /api/auth; sem login anônimo automático)
export const auth: Auth = getAuth(app);

// Inicializa Firebase App Check quando VITE_RECAPTCHA_SITE_KEY estiver configurada
if (typeof window !== 'undefined') {
  const recaptchaSiteKey = String(import.meta.env.VITE_RECAPTCHA_SITE_KEY || '').trim();
  if (recaptchaSiteKey) {
    try {
      const providerMode = String(import.meta.env.VITE_RECAPTCHA_PROVIDER || '').trim().toLowerCase();
      initializeAppCheck(app, {
        provider:
          providerMode === 'enterprise'
            ? new ReCaptchaEnterpriseProvider(recaptchaSiteKey)
            : new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (appCheckErr) {
      console.warn('Aviso ao inicializar Firebase App Check:', appCheckErr);
    }
  }
}

export default app;
