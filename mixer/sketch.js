let play;
let tracks;
let solos;
let numSolo;
let x = 0;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();

  button = createButton('Play');
  button.position(20, 75);
  button.mousePressed(togglePlay);
  this.slider = createSlider(0,100,0);
  this.slider.position(20,50);
  solos = [];
  numSolo = 0;
}

function preload() {
  tracks = [];
  tracks.push(new Track('assets/Lab Children_Drum Bus.wav', 1));
  tracks.push(new Track('assets/Lab Children_Chords Synth.wav', 2));
  tracks.push(new Track('assets/Lab Children_Lead Synth.wav', 3));
  tracks.push(new Track('assets/Lab Children_Lead Marimba.wav', 4));
  tracks.push(new Track('assets/Lab Children_Lead Synth_2.wav', 5));

}

function draw() {
  // put drawing code here
  for (var i = 0; i < tracks.length; i++) {
    solos.push(tracks[i].solo.isSolo);
    if (tracks[i].solo.isSolo) numSolo++;
  }

  for (var i = 0; i < tracks.length; i++) {
    if(tracks[i].file.isPlaying())
      tracks[i].setVolume(numSolo);
  }

  if(tracks[0].file.isPlaying()){
    this.slider.value(x + 0.1);
    x += 0.1
  }
  solos = [];
  numSolo = 0;
}

function togglePlay() {
  for (var i = 0; i < tracks.length; i++) {
    if(tracks[i].file.isPlaying()) {
      tracks[i].file.pause();
      button.html("Play");
    }
    else {
      tracks[i].file.play();
      button.html("Pause");
    }
  }
}

class Track {
  constructor(f, mixerNumber) {
    this.file = loadSound(f, this.loaded);
    this.mixerNumber = mixerNumber;
    this.slider = createSlider(0,10,0);
    this.slider.position(mixerNumber * 100,70);
    this.slider.style('rotate', '-90');



    this.mute = createButton('Mute');
    this.mute.position(mixerNumber*100 + 45, 150);
    this.mute.mousePressed(this.toggleMute);
    this.mute.muted = false;

    this.solo = createButton('Solo');
    this.solo.position(mixerNumber * 100 + 45, 170);
    this.solo.mousePressed(this.toggleSolo);
    this.solo.isSolo = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.html("Unmute");
    }
    else {
      this.html("Mute");
    }
  }

  toggleSolo() {
    this.isSolo = !this.isSolo;
    if (this.isSolo) {
      this.html("Un-solo");
    }
    else {
      this.html("Solo");
    }
  }

  isSolo() {
    return this.solo.isSolo;
  }

  setVolume(numSolo) {
    if (numSolo > 0) {
      if (!this.solo.isSolo || this.mute.muted) this.file.amp(0);
      else {
        this.file.amp(this.slider.value());
      }
    }
    else if (this.mute.muted) {
      this.file.amp(0);
    } else {
      this.file.amp(this.slider.value());
    }
  }

  loaded() {
    console.log("loaded");
  }

}
