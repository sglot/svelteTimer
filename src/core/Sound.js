export class Sound {
    constructor(mute, src) {
        console.log(mute);
        console.log("================================================================================");
        console.log((typeof mute === "boolean"));

        this.mute = mute;
        this.sound = new Audio();
        this.sound.preload = 'auto';
        this.sound.src = src;
        this.alreadyPlay = false;
    }

    replay() {
        if (this.alreadyPlay) stop();
        if (this.mute) return;
        this.sound.play();
        this.alreadyPlay = true;
        console.log("alreadyPlay---" + this.alreadyPlay);
    }

    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
        // this.alreadyPlay = false;
        console.log("alreadyPlay---" + this.alreadyPlay);
    }

  }