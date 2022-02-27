
class Level {
  constructor(config) {
    this.ctx = config.ctx;
    this.audio = config.audio;
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
    if (SPRITE_COUNTER === this.allSprites.length && AUDIO_LOADED) {
      return true;
    }
    return false;
  }

  reloadGame() {
    window.location.reload();
  }

  init() {
    this.createMap();
    this.ui = new UI({ player: this.player, ctx:this.ctx });

    Audio.prototype.play = (function(play) {
      return function () {
        var audio = this,
            args = arguments,
            promise = play.apply(audio, args);
        if (promise !== undefined) {
          promise.catch(_ => {
            // Autoplay was prevented. This is optional, but add a button to start playing.
            let button = document.getElementById("play");
            button.addEventListener("click", function(){play.apply(audio, args);});
          });
        }
      };
      })(Audio.prototype.play);
    
    this.audio.themeTracks['level1'].play();
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
      this.createMagic.bind(this));
    
    this.animationPlayer = new AnimationPlayer({ player: this.player, ctx:this.ctx }, [ this.visibleSprites, this.allSprites ]);
    this.magicPlayer = new MagicPlayer(this.animationPlayer);
    
    for (const [style, layoutMap] of Object.entries(layouts)) {
      for (let rowIndex = 0; rowIndex < layoutMap.length; rowIndex++) {
        let row = layoutMap[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] !== '-1') {
            let x = colIndex * TILE_SIZE;
            let y = rowIndex * TILE_SIZE;
            if (style === 'boundaries') {
              new Sprite(
                { x:x, y:y, src:"graphics/test/player.png", spriteType:'invisible', player:this.player, ctx:this.ctx },
                [this.obstacleSprites, this.allSprites]);
            }
            if (style === 'grasses') {
              let randomGrassIndex = Math.floor(Math.random() * 3) + 1;
              new Sprite(
                  { x:x, y:y, src:`graphics/grass/grass_${randomGrassIndex}.png`, spriteType:'grass', player:this.player, ctx:this.ctx }
                  , [this.obstacleSprites, this.attackableSprites, this.allSprites]);
            }
            if (style === 'objects') {
              let objectIndex = twoDigitNumber.format(row[colIndex]);
              new Sprite(
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
                
                new Enemy(
                  { x:x, y:y, spriteType:monsterName, player:this.player, ctx:this.ctx}
                  , [this.visibleSprites, this.attackableSprites, this.allSprites], 
                  this.obstacleSprites
                  , this.damagePlayerLogic.bind(this));
              }
            }
          }
        }
      }
    }
    this.mapSprite = new Map({ src: this.src, player:this.player, ctx: this.ctx });
  }

  createMagic(type, strength, cost) {
    if (type === 'heal') {
      this.magicPlayer.heal(this.player, strength, cost, [this.visibleSprites, this.allSprites]);
      this.audio.magicTracks['heal'].play();
    } else if (type === 'flame') {
      this.magicPlayer.flame(this.player, cost, [this.visibleSprites, this.attackSprites, this.allSprites]);
      this.audio.magicTracks['flame'].play();
    }
  }

  createWeapon() {
    this.weapon = new Weapon(
      { player:this.player, ctx: this.ctx},
      [this.visibleSprites, this.attackSprites, this.allSprites]);
    this.audio.attackTracks['weapon'].play();
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
        let cachedAttackType = attackSprite.spriteType;

        this.attackableSprites.forEach(attackableSprite => {
          if (attackableSprite.rect.collideRect(cachedRect)) {
            if (attackableSprite.spriteType === 'grass') {
              let posX = attackableSprite.x - 32; // because the animation sprites are wrongly coordinated that we need this hack
              let posY = attackableSprite.y - 64; // because the animation sprites are wrongly coordinated that we need this hack
              this.animationPlayer.createGrassParticles(posX, posY, 1, [this.visibleSprites, this.allSprites]);
              this.animationPlayer.createGrassParticles(posX, posY, 2, [this.visibleSprites, this.allSprites]);
              this.animationPlayer.createGrassParticles(posX, posY, 6, [this.visibleSprites, this.allSprites]);
              attackableSprite.delete();
            } else {
              attackableSprite.takeDamage(cachedAttackType);
              if (attackableSprite.health <= 0) {
                let posX = attackableSprite.x;
                let posY = attackableSprite.y;
                this.animationPlayer.createDeathParticles(posX, posY, attackableSprite.spriteType, [this.visibleSprites, this.allSprites]);
                attackableSprite.delete();
                this.audio.normalDeath.play();
              }
              this.audio.normalHit.play();
            }
          }
        }, this)
      }
    }
  }

  damagePlayerLogic(player, damage, attackType) {
    this.animationPlayer.createAttackParticles(this.player.x, this.player.y, attackType, [this.visibleSprites, this.allSprites]);
    // this.audio.attackTracks[attackType].play();
    player.takeDamage(damage);
    if (player.health <= 0) {
      player.health = 0;
      this.audio.deathTracks['player'].play();
      this.reloadGame();
    }
    this.audio.hitTracks['player'].play();

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