let vSlider;
let play;

let song;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();

  //create slider
  vSlider = createSlider(0, 10, 0);
  vSlider.position(20,70);
  vSlider.style('rotate', -90)
  button = createButton('Play');
  button.position(170, 20);
  song = loadSound('assets/sandman.mp3');
  button.mousePressed(playpause);
}

function mousePressed() {
  // if ( song.isPlaying() ) { // .isPlaying() returns a boolean
  //   song.stop();
  //   background(255,0,0);
  // } else {
  //   song.play();
  //   background(0,255,0);
  // }
  // song.play();
}
function draw() {
  // put drawing code here
  song.amp(vSlider.value());
}

function playpause() {
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.stop();
  } else {
    song.play();
  }
}
