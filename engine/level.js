
class Level {
  constructor(config) {
    this.ctx = config.ctx;
    this.mapSprite = new Map({ src: config.src, ctx: this.ctx });
    this.input = config.input;

    this.player = null;
    this.visibleSprites = [];
    this.obstacleSprites = [];
    this.allSprites = [];
  }

  isLoaded() {
    if (SPRITE_COUNTER === this.allSprites.length) {
      return true;
    }
    return false;
  }

  init() {
    this.createMap();
  }

  createMap() {
    let layouts = {
      'boundary': map_floor_blocks,
      'grass': map_grasses,
      'object': map_objects,
    }
    for (const [style, layoutMap] of Object.entries(layouts)) {
      for (let rowIndex = 0; rowIndex < layoutMap.length; rowIndex++) {
        let row = layoutMap[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] !== '-1') {
            let x = colIndex * TILE_SIZE;
            let y = rowIndex * TILE_SIZE;
            if (style === 'boundary') {
              this.obstacleSprites.push(new Sprites({x:x, y:y, src:"graphics/test/player.png", spriteType:'invisible', ctx:this.ctx}));
            }
            if (style === 'grass') {
              let randomGrassIndex = Math.floor(Math.random() * 3) + 1;
              this.obstacleSprites.push(new Sprites({x:x, y:y, src:`graphics/grass/grass_${randomGrassIndex}.png`, spriteType:'grass', ctx:this.ctx}));
            }
            if (style === 'object') {
              let objectIndex = twoDigitNumber.format(row[colIndex]);
              this.obstacleSprites.push(new Sprites({x:x, y:y, src:`graphics/objects/${objectIndex}.png`, spriteType:'object', ctx:this.ctx}));
            }
          }
        }
      }
    }
    this.player = new Player({x:2000, y:1000, src:"graphics/test/player.png", 
                              animationSprites: player_animation_sprites, 
                              totalAnimationSprites: num_player_animation_sprites, 
                              spriteType:'player', overlapX: -10, overlapY: -26,
                              ctx:this.ctx}, this.obstacleSprites);

    this.visibleSprites.push(this.player);
    this.allSprites = this.obstacleSprites.concat(this.visibleSprites);
  }

  update() {
    // sprites update
    this.visibleSprites.forEach(element => element.update({ arrow: this.input.getDirection() }));
    let sortedAllSprites = this.allSprites.sort(function(a, b){ return a.rect.top - b.rect.top; })
    
    // sprites draw
    this.mapSprite.draw(this.player);
    sortedAllSprites.forEach(element => element.draw(this.player));
  }
}