import {Injectable} from "@angular/core";

@Injectable()
export class SoundService {

  audio: any;

  constructor() {
    this.audio = new Audio;
  }

  playSound(audioSrc: string): void {
    this.audio.src = audioSrc;
    this.audio.load();
    this.audio.play();
  }
}
