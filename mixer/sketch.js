let vSlider;
let song;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();

  //create slider
  vSlider = createSlider(0, 10, 100);
  vSlider.position(20,20);
  preload();
  song = loadSound('assets/sandman.mp3');

}

function mousePressed() {
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.stop();
    background(255,0,0);
  } else {
    song.play();
    background(0,255,0);
  }
}
function draw() {
  // put drawing code here
  song.amp(vSlider.value());
}
