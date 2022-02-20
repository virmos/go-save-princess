
class Game {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.level = new Level({ src: "graphics/tilemap/ground.png", ctx: this.ctx });
  }

  init() {
    this.input = new Keyboard();
    this.input.init();
    this.startGameLoop();
 
  }
 
  startGameLoop() {
    this.level.init();

    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.update();
      this.draw();
      requestAnimationFrame(() => {
       step();   
      })
    }
    step();
  }

  update() {
    this.level.visibleSprites.forEach(element => element.update({ arrow: this.input.getDirection() }));
  }

  draw() {
    this.level.draw();
    let sortedAllSprites = this.level.allSprites.sort(function(a, b){ return a.rect.top - b.rect.top; })
    sortedAllSprites.forEach(element => element.draw(this.level.player));
  }
}