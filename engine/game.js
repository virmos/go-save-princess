
class Game {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.map = null;
    this.player = null;
    this.visibleSprites = [];
    this.obstacleSprites = [];
    this.allSprites = [];
  }
 
  startGameLoop() {
    this.createMap();

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

  createMap() {
    for (let rowIndex = 0; rowIndex < this.map.length; rowIndex++) {
      let row = this.map[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        let x = colIndex * 64;
        let y = rowIndex * 64;
        if (row[colIndex] === 'x') {
          this.obstacleSprites.push(new Sprites({x:x, y:y, src:"graphics/test/rock.png", ctx:this.ctx}));
        }
        if (row[colIndex] === 'p') {
          this.player = new Player({x:x, y:y,src:"graphics/test/player.png", ctx:this.ctx}, this.obstacleSprites);
          this.visibleSprites.push(this.player);
        }
      }
    }
    this.allSprites = this.obstacleSprites.concat(this.visibleSprites);
  }

  update() {
    this.visibleSprites.forEach(element => element.update({ arrow: this.input.getDirection() }));
  }

  draw() {
    let sortedAllSprites = this.allSprites.sort(function(a, b){ return a.rect.top - b.rect.top; })
    sortedAllSprites.forEach(element => element.draw(this.player));
  }
 
  init() {
   this.map = [
    ['x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x'],
    ['x',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ','p',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ','x','x','x','x','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x','x','x',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ','x',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ','x','x','x','x','x',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ','x','x','x',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ',' ','x',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','x'],
    ['x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x'],
    ];
    
    this.input = new Keyboard();
    this.input.init();
    this.startGameLoop();
 
  }
}