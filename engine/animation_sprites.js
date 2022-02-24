class AnimationSprites {
  constructor(config) {
    //Set up the image
    this.ctx = config.ctx;
    this.player = this;
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
    this.image.onload = this.createDefaultHitbox.bind(this);
  }

  createDefaultHitbox() {
    this.localSpriteCounter += 1;

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

  init() {
    SPRITE_COUNTER += 1;
  };

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