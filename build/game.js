
class Game {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.input = new Keyboard();
    this.input.init();

    this.audio = new AudioPlayer();
    this.level = new Level({ src: "graphics/tilemap/ground.png", ctx: this.ctx, audio: this.audio, input: this.input });
  }

  init() {
    this.level.init();
    const checkIfLevelLoaded = () => {
      let startId = requestAnimationFrame(() => {
        checkIfLevelLoaded();   
      })
      if (this.level.isLoaded() === true) {
        this.startGameLoop();
        cancelAnimationFrame(startId);
      }
    }
    checkIfLevelLoaded();
  }
 
  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.level.update();
      requestAnimationFrame(() => {
       step();   
      })
    }
    step();
  }
}