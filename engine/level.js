
class Level {
  constructor(config) {
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.ctx = config.ctx;

    this.player = null;
    this.visibleSprites = [];
    this.obstacleSprites = [];
    this.allSprites = [];
  }

  init() {
    this.createMap();
  }

  createMap() {
    let layouts = {
      'boundary': map_floor_blocks,
      'grass': map_grass,
    }
    for (const [style, layoutMap] of Object.entries(layouts)) {
      for (let rowIndex = 0; rowIndex < layoutMap.length; rowIndex++) {
        let row = layoutMap[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] !== '-1') {
            let x = colIndex * TILE_SIZE;
            let y = rowIndex * TILE_SIZE;
            if (style === 'boundary') {
              this.obstacleSprites.push(new Sprites({x:x, y:y, spriteType:'invisible', ctx:this.ctx}));
            }
            if (style === 'grass') {
              let randomGrassIndex = Math.floor(Math.random() * 3) + 1;
              this.obstacleSprites.push(new Sprites({x:x, y:y, src:`graphics/grass/grass_${randomGrassIndex}.png`, spriteType:'grass', ctx:this.ctx}));
            }
          }
        }
      }
    }
    this.player = new Player({x:2000, y:1000,src:"graphics/test/player.png", spriteType:'player', ctx:this.ctx}, this.obstacleSprites);
    this.visibleSprites.push(this.player);
    this.allSprites = this.obstacleSprites.concat(this.visibleSprites);
  }

  draw() {
    let offsetX = (this.player.rect.left + 32) - 1280 / 2; // player.rect.left, top + 32 to calculate center of player
    let offsetY = (this.player.rect.top + 32) - 720 / 2;  // 

    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      3648,3200,  // image width and height
      -offsetX, -offsetY,
      3648,3200,
    )
  }
}