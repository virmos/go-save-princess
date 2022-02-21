class AnimationSprites {
  constructor(config) {
    //Set up the image
    this.ctx = config.ctx;
    this.src = config.src;
    this.spriteType = config.spriteType;

    this.x = config.x;
    this.y = config.y;

    this.overlapX = config.overlapX;
    this.overlapY = config.overlapY;

    this.animationSprites = config.animationSprites;
    this.totalLocalSprites = config.totalAnimationSprites + 1; // for default sprite

    this.localSpriteCounter = 0;
    this.animationSpeed = 0.25;
    this.animationIndex = 0;
    this.speed = 5;

    this.image = new Image();

    this.animations = {
      'up': [],
      'up_idle': [], 
      'up_attack': [], 
      'down': [], 
      'down_idle':[],
      'down_attack': [],
      'left': [], 
      'left_idle': [],
      'left_attack': [],
      'right': [],
      'right_idle': [],
      'right_attack': [],
    }
    this.loadDefaultSprite();
    this.loadAnimationSprites();

  }

  loadDefaultSprite() {
    this.image.src = this.src;
    this.image.onload = this.loadDefaultComplete.bind(this);
  }

  loadDefaultComplete() {
    this.localSpriteCounter += 1;
    let imageOffsetY = this.spriteType === 'object' ? TILE_SIZE : 0;

    this.rect = new Rect({top: this.y - imageOffsetY, bottom: this.y + this.image.height - imageOffsetY, 
                          left: this.x, right:  this.x + this.image.width});
    this.hitbox = new Rect(this.rect.inflate(this.overlapX, this.overlapY));
  }

  loadAnimationSprites() {
    let caller = this;
    for (const [animationName, animationSources] of Object.entries(this.animationSprites)) {
      for (let sourceIndex in animationSources) {
        let animationImage = new Image();
        animationImage.src = animationSources[sourceIndex];
        animationImage.onload = this.loadAnimationComplete.bind(caller, animationName, animationImage);
      }
    }
  }

  loadAnimationComplete(animationName, animationImage) {
    this.animations[animationName].push(animationImage);
    this.localSpriteCounter += 1;
    if (this.localSpriteCounter === this.totalLocalSprites) {
      this.init();
    }
  }

  init() {
    SPRITE_COUNTER += 1;
  };

  draw(player) {
    if (this.spriteType === 'invisible')
      return;

    if (!this.image)
      console.log(this)
    
    let offsetX = (player.rect.left + TILE_SIZE / 2) - SCREEN_WIDTH / 2;  // player.rect.left, top + TILE_SIZE / 2 to calculate center of player
    let offsetY = (player.rect.top + TILE_SIZE / 2) - SCREEN_HEIGHT / 2;  // 
    this.ctx.drawImage(this.image,
      0,0,
      this.image.width,this.image.height,
      this.rect.left - offsetX, this.rect.top - offsetY,
      this.image.width,this.image.height
    )
  }
}