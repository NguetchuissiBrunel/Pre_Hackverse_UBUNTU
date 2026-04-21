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
      const name = key as keyof typeof AUDIO_PATHS.sfx;
      this.sfxLib[name] = new Howl({
        src: [sfxList[name]],
        volume: 1.0,
        preload: true,
        onloaderror: (id, err) => console.warn(`Erreur de chargement SFX [${name}] :`, err),
        onplayerror: (id, err) => {
          console.warn(`Erreur de lecture SFX [${name}] :`, err);
          this.resumeContext();
        }
      });
    });
  }

  private async resumeContext() {
    if (this.ctxResumed) return;
    // @ts-ignore
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      // @ts-ignore
      await Howler.ctx.resume();
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

  public playAmbience(name: keyof typeof AUDIO_PATHS.ambience) {
    // Désactivé à la demande de l'utilisateur
    return;
  }

  public stopAmbience() {
    // Désactivé à la demande de l'utilisateur
    return;
  }

  public toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    // @ts-ignore
    if (typeof Howler !== 'undefined') {
      // @ts-ignore
      Howler.mute(!this.soundEnabled);
    }
    return this.soundEnabled;
  }
}

export const audioManager = new AudioManager();
