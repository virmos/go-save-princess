class Player extends Sprites {
  constructor(config, obstacleSprites) {
    //Set up the image
    super(config);

    this.overlapX = -10;
    this.overlapY = -26;
    
    this.direction = new Vector2D(0, 0)
    this.speed = 5;
    this.obstacleSprites = obstacleSprites;

    this.isAttacking = false;
    this.attackCooldownTimeout = 400;
  }

  init() {
    this.isLoaded = true;
    this.hitbox = new Rect(this.rect.inflate(this.overlapX, this.overlapY));
    SPRITE_COUNTER += 1;
  }

  input(arrow) {
    if (!arrow) {
      this.direction.x = 0;
      this.direction.y = 0;
    }

    if (arrow === 'up') {
      this.direction.y = -1;
    }  else if (arrow === 'down') {
      this.direction.y = 1;
    }  

    if (arrow === 'left') {
      this.direction.x = -1;
    }  else if (arrow === 'right') {
      this.direction.x = 1;
    } 
    
    if (this.direction.magnitude() != 0) {
      this.direction.normalize();
    }

    if (arrow ===  'enter'&& !this.isAttacking) {
      console.log('attack')
      this.isAttacking = true;
      setTimeout(this.cooldown.bind(this), this.attackCooldownTimeout);
    }

    if (arrow === 'space' && !this.isAttacking) {
      console.log('magic')
      this.isAttacking = true;
      setTimeout(this.cooldown.bind(this), this.attackCooldownTimeout);

    }
  }

  cooldown() {
    this.isAttacking = false;
  }

  move() {
    this.hitbox.top += this.direction.y * this.speed;
    this.hitbox.bottom += this.direction.y * this.speed;
    this.collision('vertical')

    this.hitbox.left += this.direction.x * this.speed;
    this.hitbox.right += this.direction.x * this.speed;
    this.collision('horizontal')

    this.rect.update(this.hitbox.deflate(this.overlapX, this.overlapY));
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

  update(state) {
    this.input(state.arrow);
    this.move();
  }
}