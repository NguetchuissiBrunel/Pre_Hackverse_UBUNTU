"use client";

import { Howl } from 'howler';

class AudioManager {
  private sounds: Record<string, Howl> = {};
  public soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.sounds = {
        start: new Howl({ src: ['/sounds/sfx_start.mp3'], volume: 0.5 }),
        end: new Howl({ src: ['/sounds/sfx_end.mp3'], volume: 0.7 }),
        pause: new Howl({ src: ['/sounds/sfx_pause.mp3'], volume: 0.3 }),
        levelup: new Howl({ src: ['/sounds/sfx_levelup.mp3'], volume: 0.8 }),
        rain: new Howl({ src: ['/sounds/amb_rain.mp3'], loop: true, volume: 0.2 }),
        fire: new Howl({ src: ['/sounds/amb_fire.mp3'], loop: true, volume: 0.2 }),
        cafe: new Howl({ src: ['/sounds/amb_cafe.mp3'], loop: true, volume: 0.2 }),
      };
      
      const stored = localStorage.getItem('sound_enabled');
      if (stored !== null) this.soundEnabled = stored === 'true';
    }
  }

  playSfx(name: string) {
    if (!this.soundEnabled || !this.sounds[name]) return;
    this.sounds[name].play();
  }

  startAmbience(name: string) {
    if (!this.soundEnabled || !this.sounds[name]) return;
    this.stopAllAmbience();
    this.sounds[name].play();
    this.sounds[name].fade(0, 0.2, 1000);
  }

  stopAllAmbience() {
    ['rain', 'fire', 'cafe'].forEach(name => {
      if (this.sounds[name]) {
        this.sounds[name].fade(0.2, 0, 1000);
        setTimeout(() => this.sounds[name].stop(), 1000);
      }
    });
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('sound_enabled', this.soundEnabled.toString());
    if (!this.soundEnabled) this.stopAllAmbience();
    return this.soundEnabled;
  }
}

export const audioManager = new AudioManager();
