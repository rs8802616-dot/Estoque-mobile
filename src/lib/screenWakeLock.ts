// Screen Wake Lock & Keep-Awake Engine for Tablets, Phones, PDVs and Desktops
// Keeps the screen active and prevents sleep / auto-lock while using the application

type StatusCallback = (ativo: boolean) => void;

class ScreenWakeLockManager {
  private wakeLock: any = null;
  private isEnabled: boolean = true;
  private isActive: boolean = false;
  private listeners: Set<StatusCallback> = new Set();
  private userInteractionBound: boolean = false;
  private interactionHandler: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private removerListenersInteracao() {
    if (!this.userInteractionBound || !this.interactionHandler || typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('touchstart', this.interactionHandler);
    window.removeEventListener('click', this.interactionHandler);
    window.removeEventListener('keydown', this.interactionHandler);
    this.userInteractionBound = false;
  }

  private registrarListenersInteracao() {
    if (this.userInteractionBound || typeof window === 'undefined') return;
    if (!this.interactionHandler) {
      this.interactionHandler = async () => {
        if (this.isEnabled && !this.isActive) {
          const ok = await this.requestWakeLock();
          if (ok) {
            this.removerListenersInteracao();
          }
        } else if (this.isActive) {
          this.removerListenersInteracao();
        }
      };
    }
    window.addEventListener('touchstart', this.interactionHandler, { passive: true });
    window.addEventListener('click', this.interactionHandler, { passive: true });
    window.addEventListener('keydown', this.interactionHandler, { passive: true });
    this.userInteractionBound = true;
  }

  private init() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isEnabled) {
        this.requestWakeLock();
      }
    });

    window.addEventListener('focus', () => {
      if (this.isEnabled) {
        this.requestWakeLock();
      }
    });

    this.registrarListenersInteracao();
    this.requestWakeLock();
  }

  public async requestWakeLock(): Promise<boolean> {
    if (!this.isEnabled) return false;

    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (this.wakeLock && !this.wakeLock.released) {
          this.notifyStatus(true);
          this.removerListenersInteracao();
          return true;
        }

        const nav = navigator as any;
        this.wakeLock = await nav.wakeLock.request('screen');
        this.notifyStatus(true);
        this.removerListenersInteracao();

        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
          this.notifyStatus(false);
          if (this.isEnabled) {
            this.registrarListenersInteracao();
            if (document.visibilityState === 'visible') {
              setTimeout(() => this.requestWakeLock(), 1000);
            }
          }
        });

        return true;
      } catch (err) {
        console.warn('Wake Lock nativo aguardando interação ou indisponível:', err);
        this.registrarListenersInteracao();
      }
    }

    this.notifyStatus(false);
    return false;
  }

  public releaseWakeLock() {
    this.isEnabled = false;
    this.removerListenersInteracao();
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
      } catch (e) {}
      this.wakeLock = null;
    }
    this.notifyStatus(false);
  }

  public habilitar() {
    this.isEnabled = true;
    this.requestWakeLock();
  }

  public getStatus(): boolean {
    return this.isActive;
  }

  public subscribe(cb: StatusCallback): () => void {
    this.listeners.add(cb);
    cb(this.isActive);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyStatus(ativo: boolean) {
    this.isActive = ativo;
    this.listeners.forEach((cb) => {
      try {
        cb(ativo);
      } catch (e) {}
    });
  }
}

export const screenWakeLockManager = new ScreenWakeLockManager();
