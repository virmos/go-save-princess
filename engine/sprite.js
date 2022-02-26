class Sprite {
  constructor(config, groups, obstacleSprites) {
    // setup the default image
    this.image = new Image();
    this.ctx = config.ctx;
    this.globalAlpha = 1.0;
    this.src = config.src;
    this.spriteType = config.spriteType;
    this.overlapX = config.overlapX;
    this.overlapY = config.overlapY;

    // setup the coordinates
    this.x = config.x;
    this.y = config.y;
    this.centerX = null;
    this.centerY = null;

    // setup animation images
    this.animationSprites = config.animationSprites;
    this.totalLocalSprites = config.totalAnimationSprites + 1; // for default sprite

    this.localSpriteCounter = 0;
    this.animationSpeed = config.animationSpeed;
    this.animationIndex = 0;

    this.animations = config.animations;
    this.loadDefaultSprite();

    // setup player (for draw function)
    if (this.spriteType === 'player')
      this.player = this;
    else 
      this.player = config.player;
    this.groups = groups;
    this.obstacleSprites = obstacleSprites;
  }

  loadDefaultSprite() {
    this.image.src = this.src;
    this.image.onload = this.createDefaultHitbox.bind(this);
  }

  createDefaultHitbox() {
    let imageOffsetY = this.spriteType === 'object' ? TILE_SIZE : 0; // can replace TILE_SIZE = this.image.height / 2
    this.y = this.y - imageOffsetY;

    this.centerX = this.x + this.image.width / 2;
    this.centerY = this.y + this.image.height / 2;
    this.rect = new Rect(this.x, this.y, this.image.width, this.image.height);

    this.init();
  }

  collideSprite(other) {
    return this.rect.collideRect(other.rect);
  }

  init() {
    SPRITE_COUNTER += 1;
    this.groups.forEach(group => group.push(this));
  };

  delete() {
    this.rect = null;
    this.image = null;
    this.collect();
  }

  collect() {
    this.groups.forEach(group => {
      for (let index in group) {
        if (!group[index].rect) {
          group.splice(index, 1);
        }
      }
    })
  }

  draw() {
    if (this.spriteType === 'invisible' || !this.rect) // if invisible sprite or sprite is not loaded
      return;
    let offsetX = (this.player.rect.x + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + TILE_SIZE / 2 to calculate center of player
    let offsetY = (this.player.rect.y + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 

    this.ctx.drawImage(this.image,
      0,0,
      this.image.width,this.image.height,
      this.rect.x - offsetX, this.rect.y - offsetY,
      this.image.width,this.image.height
    )
  }
}