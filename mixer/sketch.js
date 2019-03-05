let play;
let tracks;
let solos;
let numSolo;
let x = 0;
let selectedBand;
let bands = ['Lows', 'Mids', 'HIs'];

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();
  fft = new p5.FFT();
  button = createButton('Play');
  button.position(20, 75);
  button.mousePressed(togglePlay);
  this.slider = createSlider(0,100,0);
  this.slider.position(130,325);
  this.slider.style('width', '475px');
  this.slider.mousePressed(scrub);
  solos = [];

  selectedBand = [];
  for (var i = 0; i < tracks.length; i++) {
    selectedBand.push(tracks[i].dropdown.selected());
  }

  numSolo = 0;
}

function scrub(){
  togglePlay();

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
    if (tracks[i].dropdown.selected() != selectedBand[i]) {
      tracks[i].eq.bands[catchNum(selectedBand[i])].gain(tracks[i].eqslider.value());
      selectedBand[i] = tracks[i].dropdown.selected();
      tracks[i].eqslider.value(tracks[i].eq.bands[catchNum(selectedBand[i])].gain());
    }
  }

  for (var i = 0; i < tracks.length; i++) {
    if(tracks[i].file.isPlaying())
      tracks[i].setVolume(numSolo);
  }
  curr =  100*tracks[0].file.currentTime()/tracks[0].file.duration();

  if(tracks[0].file.isPlaying()){
    this.slider.value(curr);
    x = curr;
  }

// VISUALIZATION CODE STARTS HERE
  var spectrum = fft.analyze();
  noStroke();
  fill(0,0,0);
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
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

    //  Sound file
    this.file = loadSound(f, this.loaded);

    //  Mixer number for positioning
    this.mixerNumber = mixerNumber;

    //  Volume Slider
    this.slider = createSlider(0,10,5, 0.1);
    this.slider.position(mixerNumber * 100,70);
    this.slider.style('rotate', '-90');

    //  Mute Button
    this.mute = createButton('Mute');
    this.mute.position(mixerNumber*100 + 45, 165);
    this.mute.mousePressed(this.toggleMute);
    this.mute.muted = false;

    //  Solo Button
    this.solo = createButton('Solo');
    this.solo.position(mixerNumber * 100 + 47, 195);
    this.solo.mousePressed(this.toggleSolo);
    this.solo.isSolo = false;

    //  Dropdown menu
    this.dropdown = createSelect();
    this.dropdown.position(mixerNumber * 100 + 37, 225);
    this.dropdown.option('HIs','HIs');
    this.dropdown.option('Mids','Mids');
    this.dropdown.option('Lows','Lows');

    //  Band Processor
    this.eq = new p5.EQ(3);
    this.file.disconnect();
    this.eq.process(this.file);

    //  EQ-Band level slider
    this.eqslider = createSlider(-12, 12, 0, 0.1);
    this.eqslider.style('width', '80px');
    this.eqslider. position(mixerNumber*100 + 25, 260);
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
