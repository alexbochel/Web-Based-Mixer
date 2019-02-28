let play;

let tracks;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();

  tracks = [];
  tracks.push(new Track('assets/sandman.mp3'));

  button = createButton('Play');
  button.position(170, 20);
  button.mousePressed(togglePlay);
}

function draw() {
  // put drawing code here
  for (var i = 0; i < tracks.length; i++) {
    if(tracks[i].file.isPlaying())
      tracks[i].setVolume();
  }
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

//FOR MUTE
//SET AMP TO ZERO AND GET SLIDER VALUE ON UNMUTE

class Track {
  constructor(f) {
    this.file = loadSound(f, this.loaded);
    this.slider = createSlider(0,10,100);
    this.slider.position(20,70);
    this.slider.style('rotate', '-90');
  }

  setVolume() {
    this.file.amp(this.slider.value());
  }

  loaded() {
    console.log("loaded");
  }

}
