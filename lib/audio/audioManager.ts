import { Howl } from 'howler';

// Le chemin virtuel vers nos futurs sons (dans public/sounds/)
// Actuellement ce sont des chemins fictifs. L'utilisateur devra placer ses fichiers ici.
const AUDIO_PATHS = {
  sfx: {
    start: '/sounds/sfx_start.mp3',
    end: '/sounds/sfx_end.mp3',
    pause: '/sounds/sfx_pause.mp3',
    levelUp: '/sounds/sfx_levelup.mp3',
  },
  ambience: {
    rain: '/sounds/amb_rain.mp3',
    fire: '/sounds/amb_fire.mp3',
    cafe: '/sounds/amb_cafe.mp3',
  }
};

class AudioManager {
  private sfxLib: Record<string, Howl> = {};
  private currentAmbience: Howl | null = null;
  private currentAmbienceId: string | null = null;
  public soundEnabled: boolean = true;
  private ctxResumed: boolean = false;

  constructor() {
    // Initialisation des effets sonores avec preload
    if (typeof window !== 'undefined') {
      this.initSounds();
    }
  }

  private initSounds() {
    const sfxList = AUDIO_PATHS.sfx;
    Object.keys(sfxList).forEach((key) => {
      this.sfxLib[key] = new Howl({
        src: [sfxList[key as keyof typeof AUDIO_PATHS.sfx]],
        volume: 1.0,
        preload: true,
        onloaderror: (id, err) => console.warn(`Erreur de chargement SFX [${key}] :`, err),
        onplayerror: (id, err) => {
          console.warn(`Erreur de lecture SFX [${key}] :`, err);
          this.resumeContext();
        }
      });
    });
  }

  private async resumeContext() {
    if (this.ctxResumed) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((Howler as any).ctx && (Howler as any).ctx.state === 'suspended') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (Howler as any).ctx.resume();
      this.ctxResumed = true;
      console.log("Audio Context repris avec succès.");
    }
  }

  public playSfx(name: keyof typeof AUDIO_PATHS.sfx) {
    if (!this.soundEnabled) return;
    this.resumeContext();
    
    const sfx = this.sfxLib[name];
    if (sfx) {
      sfx.stop(); // Arrête l'instance précédente si elle joue encore
      const id = sfx.play();
      
      // Sécurité : arrêt automatique après 10 secondes
      setTimeout(() => {
        sfx.stop(id);
      }, 10000);
    } else {
      console.log(`[Audio] Son introuvable : ${name}`);
    }
  }

  public stopAllSfx() {
    Object.values(this.sfxLib).forEach(sfx => sfx.stop());
  }

  public playAmbience() {
    // Désactivé à la demande de l'utilisateur
    return;
  }

  public stopAmbience() {
    // Désactivé à la demande de l'utilisateur
    return;
  }

  public toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (Howler as any) !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Howler as any).mute(!this.soundEnabled);
    }
    return this.soundEnabled;
  }
}

export const audioManager = new AudioManager();
