let vSlider;
let play;

let song;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  noStroke();

  //create slider
  vSlider = createSlider(0, 10, 100);
  vSlider.position(20,20);
  button = createButton('Play');
  button.position(170, 20);
  song = loadSound('assets/sandman.mp3');
  button.mousePressed(togglePlay);
}

function draw() {
  // put drawing code here
  song.amp(vSlider.value());
}

function togglePlay() {
  if ( song.isPlaying() ) {
    button.html("Play");
    song.pause();
  } else {
    button.html("Pause");
    song.play();
  }
}

//FOR MUTE
//SET AMP TO ZERO AND GET SLIDER VALUE ON UNMUTE
