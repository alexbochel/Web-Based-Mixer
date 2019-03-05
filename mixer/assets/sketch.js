let play;
let tracks;
let solos;
let numSolo;
let x = 0;
let selectedBand;
let bands = ['Lows', 'Mids', 'HIs'];
let slider;
let canvas;
let bg;

function setup() {
  // put setup code here
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  
  bg = loadImage('assets/background.jpg');
  
  noStroke();

  button = createButton('Play');
  button.position(window.innerWidth / 4 + 20, 75);
  button.mousePressed(togglePlay);
  slider = createSlider(0,100,0);
  slider.position(window.innerWidth / 4 + 130,325);
  slider.style('width', '475px');
  slider.mousePressed(scrub);
  solos = [];
    fft = new p5.FFT();
  selectedBand = [];
  for (var i = 0; i < tracks.length; i++) {
    selectedBand.push(tracks[i].dropdown.selected());
  }

  numSolo = 0;
}

function scrub(){
  togglePlay();

}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
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
  clear();
  button.position(window.innerWidth / 4 + 20, 75);
  slider.position(window.innerWidth / 4 + 130,325);
  // put drawing code here
  background(bg);

  for (var i = 0; i < tracks.length; i++) {
    solos.push(tracks[i].solo.isSolo);
    if (tracks[i].solo.isSolo) numSolo++;
  }

  for (var i = 0; i < tracks.length; i++) {
    if (tracks[i].dropdown.selected() != selectedBand[i]) {
      tracks[i].eq.bands[catchNum(selectedBand[i])].gain(tracks[i].eqslider.value());
      selectedBand[i] = tracks[i].dropdown.selected();
      tracks[i].eqslider.value(tracks[i].eq.bands[catchNum(selectedBand[i])].gain());
    }
  }

  for (var i = 0; i < tracks.length; i++) {
    tracks[i].show();
    if(tracks[i].soundFile.isPlaying())
      tracks[i].setVolume(numSolo);
  }
  curr =  100*tracks[0].soundFile.currentTime()/tracks[0].soundFile.duration();

  if(tracks[0].soundFile.isPlaying()){
    this.slider.value(curr);
    x = curr;
  }
  var spectrum = fft.analyze();
  noStroke();
  fill(216,223,229);
  for (var i = 0; i< spectrum.length; i++){
  var yx = map(i, 0, spectrum.length, 0, width+100);
  var h = -height + map(spectrum[i], 0, 255, height, 0);
  rect(yx, height, width / spectrum.length, h )
  }

  solos = [];
  numSolo = 0;
}

function catchNum(band) {
  if (band == "HIs") return 2;
  else if (band == "Mids") return 1;
  else return 0;
}

function togglePlay() {
  for (var i = 0; i < tracks.length; i++) {
    if(tracks[i].soundFile.isPlaying()) {
      tracks[i].soundFile.pause();
      button.html("Play");
    }
    else {
      tracks[i].soundFile.play();
      button.html("Pause");
    }
  }
}

class Track {

  constructor(f, mixerNumber) {
    this.soundFile = loadSound(f, this.loaded);
    this.mixerNumber = mixerNumber;

    this.createVolumeSliders();
    this.createMuteButtons();
    this.createSoloButtons();
    this.createAttenuatorDropdownMenu();
    this.createBandProcessor();
    this.createEQLevelSlider();
  }


  show() {
    this.slider.position(window.innerWidth / 4 + this.mixerNumber * 100,70);
    this.mute.position(window.innerWidth / 4 + this.mixerNumber*100 + 45, 165);
    this.solo.position(window.innerWidth / 4 + this.mixerNumber * 100 + 47, 195);
    this.dropdown.position(window.innerWidth / 4 + this.mixerNumber * 100 + 37, 225);
    this.eqslider. position(window.innerWidth / 4 + this.mixerNumber*100 + 25, 260);
  }

  createVolumeSliders() {
    this.slider = createSlider(0,10,5, 0.1);
    // this.slider.position(window.innerWidth / 4 + this.mixerNumber * 100,70);
    this.slider.style('rotate', '-90');
  }

  createMuteButtons() {
    this.mute = createButton('Mute');
    // this.mute.position(this.mixerNumber*100 + 45, 165);
    this.mute.mousePressed(this.toggleMute);
    this.mute.muted = false;
  }

  createSoloButtons() {
    this.solo = createButton('Solo');
    // this.solo.position(this.mixerNumber * 100 + 47, 195);
    this.solo.mousePressed(this.toggleSolo);
    this.solo.isSolo = false;
  }

  createAttenuatorDropdownMenu() {
    this.dropdown = createSelect();
    // this.dropdown.position(this.mixerNumber * 100 + 37, 225);
    this.dropdown.option('HIs','HIs');
    this.dropdown.option('Mids','Mids');
    this.dropdown.option('Lows','Lows');
  }

  createBandProcessor() {
    this.eq = new p5.EQ(3);
    this.soundFile.disconnect();
    this.eq.process(this.soundFile);
  }

  createEQLevelSlider() {
    this.eqslider = createSlider(-12, 12, 0, 0.1);
    this.eqslider.style('width', '80px');
    // this.eqslider. position(this.mixerNumber*100 + 25, 260);
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
    //Live editing of band gain
    if (this.dropdown.selected() == 'HIs') {
      this.eq.bands[2].gain(this.eqslider.value());
    } else if (this.dropdown.selected() == 'Mids') {
      this.eq.bands[1].gain(this.eqslider.value());
    } else {
      this.eq.bands[0].gain(this.eqslider.value());
    }

    //Live editing of track volume
    if (numSolo > 0) {
      if (!this.solo.isSolo || this.mute.muted) this.soundFile.amp(0);
      else {
        this.soundFile.amp(this.slider.value());
      }
    }
    else if (this.mute.muted) {
      this.soundFile.amp(0);
    } else {
      this.soundFile.amp(this.slider.value());
    }
  }

  loaded() {
    console.log("loaded");
  }
}
