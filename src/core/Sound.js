export class Sound {
    constructor(mute, src) {
        this.mute = mute;
        this.sound = new Audio();
        this.sound.preload = 'auto';
        this.sound.src = src;
        this.alreadyPlay = false;
    }

    replay() {
        if (this.mute) return; // mute is global
        if (this.alreadyPlay) stop();
        this.sound.play();
        this.alreadyPlay = true;
    }

    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }

  }