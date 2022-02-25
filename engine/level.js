
class Level {
  constructor(config) {
    this.ctx = config.ctx;
    this.input = config.input;
    this.src = config.src;

    this.player = null;
    this.weapon = null;
    this.mapSprite = null;

    this.visibleSprites = [];
    this.obstacleSprites = [];
    this.attackableSprites = [];
    this.attackSprites = [];
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
    this.ui = new UI({ player: this.player, ctx:this.ctx });
  }

  createMap() {
    let layouts = {
      'boundaries': map_floor_blocks,
      'grasses': map_grasses,
      'objects': map_objects,
      'entities': map_entities,
    }

    this.player = new Player({ x:0, y:0, ctx:this.ctx }, 
      [this.visibleSprites, this.allSprites], this.obstacleSprites,
      this.createWeapon.bind(this), this.destroyWeapon.bind(this), 
      this.createMagic.bind(this), this.destroyMagic.bind(this));

    for (const [style, layoutMap] of Object.entries(layouts)) {
      for (let rowIndex = 0; rowIndex < layoutMap.length; rowIndex++) {
        let row = layoutMap[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] !== '-1') {
            let x = colIndex * TILE_SIZE;
            let y = rowIndex * TILE_SIZE;
            if (style === 'boundaries') {
              let boundary = new Sprite(
                { x:x, y:y, src:"graphics/test/player.png", spriteType:'invisible', player:this.player, ctx:this.ctx },
                [this.obstacleSprites, this.allSprites]);
            }
            if (style === 'grasses') {
              let randomGrassIndex = Math.floor(Math.random() * 3) + 1;
              let grass = new Sprite(
                  { x:x, y:y, src:`graphics/grass/grass_${randomGrassIndex}.png`, spriteType:'grass', player:this.player, ctx:this.ctx }
                  , [this.obstacleSprites, this.attackableSprites, this.allSprites]);
            }
            if (style === 'objects') {
              let objectIndex = twoDigitNumber.format(row[colIndex]);
              let object = new Sprite(
                { x:x, y:y, src:`graphics/objects/${objectIndex}.png`, spriteType:'object', player:this.player, ctx:this.ctx },
                [this.obstacleSprites, this.allSprites]);
            }
            if (style === 'entities') {
              if (row[colIndex] === '394') {
                this.player.addCoordinates(x, y);
              } else {
                let monsterName = 'squid';
                if (row[colIndex] === '390') { monsterName = 'bamboo' }
                else if (row[colIndex] === '391') { monsterName = 'spirit' }
                else if (row[colIndex] === '392') { monsterName = 'raccoon' }
                
                let enemy = new Enemy(
                  { x:x, y:y, spriteType:monsterName, player:this.player, ctx:this.ctx}
                  , [this.visibleSprites, this.attackableSprites, this.allSprites], this.obstacleSprites);
              }
            }
          }
        }
      }
    }
    this.mapSprite = new Map({ src: this.src, player:this.player, ctx: this.ctx });
  }

  createMagic(player) {
    this.magic = new Magic(
      { player:player, ctx: this.ctx},
      [this.visibleSprites, this.allSprites]);
  }

  destroyMagic() {
    // TODO: all sprites still contain this weapon
    this.weapon.delete();
  }

  createWeapon(player) {
    this.weapon = new Weapon(
      { player:player, ctx: this.ctx},
      [this.visibleSprites, this.attackSprites, this.allSprites]);
  }

  destroyWeapon() {
    // TODO: all sprites still contain this weapon
    this.weapon.delete();
  }

  playerAttackLogic() {
    if (this.attackSprites.length !== 0) {
      for (let index in this.attackSprites) {
        let attackSprite = this.attackSprites[index];
        let currentRect = attackSprite.rect;
        let cachedRect = new Rect(currentRect.x, currentRect.y, currentRect.width, currentRect.height); // weapon will be deleted
        
        this.attackableSprites.forEach(attackableSprite => {
          if (attackableSprite.rect.collideRect(cachedRect)) {
            if (attackableSprite.spriteType === 'grass') {
              attackableSprite.delete();
            } else {
              attackableSprite.takeDamage();
            }
          }
        }, this)
      }
    }
  }

  update() {
    // update
    this.visibleSprites.forEach(element => element.update({ arrow: this.input.getDirection() }));
    let sortedAllSprites = this.allSprites.sort(function(a, b){ return (a.rect && b.rect) ? (a.rect.top - b.rect.top) : -1; })
    this.playerAttackLogic();
    this.ui.update();
    
    // draw
    this.mapSprite.draw();
    sortedAllSprites.forEach(element => element.draw());
    this.ui.draw()
  }
}