export class Sound {
    mute:           boolean;
    sound:          HTMLAudioElement;
    alreadyPlay:    boolean;
    
    constructor(mute: boolean, src: string) {
        this.mute           = mute;
        this.alreadyPlay    = false;
        this.sound          = new Audio();
        this.sound.preload  = 'auto';
        this.sound.src      = src;
    }

    replay(): void {
        if (this.alreadyPlay) stop();
        if (this.mute) return;
        this.sound.play();
        this.alreadyPlay = true;
        console.log("alreadyPlay---" + this.alreadyPlay);
    }

    stop(): void {
        this.sound.pause();
        this.sound.currentTime = 0;
        // this.alreadyPlay = false;
        console.log("alreadyPlay---" + this.alreadyPlay);
    }

    setMute(mute: boolean): void {
        this.mute = mute;
    }

  }