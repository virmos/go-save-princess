class Entity {
  constructor(config, groups, obstacleSprites) {
    // setup the default image
    this.image = new Image();
    this.ctx = config.ctx;
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
    this.loadAnimationSprites();

    // setup player (for draw function)
    if (this.spriteType === 'player')
      this.player = this;
    else 
      this.player = config.player;
    this.groups = groups;
    this.obstacleSprites = obstacleSprites;

    // setup stats
    this.speed = 5;

  }

  loadDefaultSprite() {
    this.image.src = this.src;
    this.image.onload = this.createDefaultHitbox.bind(this);
  }

  createDefaultHitbox() {
    this.localSpriteCounter += 1;

    this.centerX = this.x + this.image.width / 2;
    this.centerY = this.y + this.image.height / 2;
    this.rect = new Rect(this.x, this.y, this.image.width, this.image.height);
    let { x, y, width, height } = this.rect.inflate(this.overlapX, this.overlapY);
    this.hitbox = new Rect(x, y, width, height);
  }

  loadAnimationSprites() {
    let caller = this;
    for (const [animationName, animationSources] of Object.entries(this.animationSprites)) {
      for (let sourceIndex in animationSources) {
        let animationImage = new Image();
        animationImage.src = animationSources[sourceIndex];
        animationImage.onload = this.createAnimationHitbox.bind(caller, animationName, animationImage);
      }
    }
  }

  createAnimationHitbox(animationName, animationImage) {
    this.animations[animationName].push(animationImage);
    this.localSpriteCounter += 1;
    if (this.localSpriteCounter === this.totalLocalSprites) {
      this.init();
    }
  }

  move() {
    this.hitbox.top += this.direction.y * this.speed;
    this.hitbox.bottom += this.direction.y * this.speed;
    this.collision('vertical')

    this.hitbox.left += this.direction.x * this.speed;
    this.hitbox.right += this.direction.x * this.speed;
    this.collision('horizontal')

    let { x, y, width, height } = this.hitbox.deflate(this.overlapX, this.overlapY);
    this.rect.update(x, y, width, height);
    this.x = this.rect.x;
    this.y = this.rect.y;
    this.centerX = this.x + this.image.width / 2;
    this.centerY = this.y + this.image.height / 2;
  }
  
  collision(verb) {
    if (verb === 'horizontal') {
      for (let spriteIndex in this.obstacleSprites) {
        let sprite = this.obstacleSprites[spriteIndex];
        if (sprite.rect.collideRect(this.hitbox) === true) {
          if (this.direction.x > 0) {
            this.hitbox.right = sprite.rect.left;
            this.hitbox.left = this.hitbox.right - this.hitbox.width;
          }
          if (this.direction.x < 0) {
            this.hitbox.left = sprite.rect.right;
            this.hitbox.right = this.hitbox.left + this.hitbox.width;
          }
        }
      }
    }

    if (verb === 'vertical') {
      for (let spriteIndex in this.obstacleSprites) {
        let sprite = this.obstacleSprites[spriteIndex];
        if (sprite.rect.collideRect(this.hitbox) === true) {
          if (this.direction.y > 0) {
            this.hitbox.bottom = sprite.rect.top;
            this.hitbox.top = this.hitbox.bottom - this.hitbox.height;
          }
          if (this.direction.y < 0) {
            this.hitbox.top = sprite.rect.bottom;
            this.hitbox.bottom = this.hitbox.top + this.hitbox.height;
          }
        }
      }
    }
  }

  addCoordinates(x, y) {
    this.x = x;
    this.y = y;
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