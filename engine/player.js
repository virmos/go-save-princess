class Player extends Sprites {
  constructor(config, obstacleSprites) {
    //Set up the image
    super(config);
    this.direction = new Vector2D(0, 0)
    this.speed = 5;
    this.obstacleSprites = obstacleSprites;
  }

  move(arrow) {
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

    this.rect.top += this.direction.y * this.speed;
    this.rect.bottom += this.direction.y * this.speed;
    this.collision('vertical')

    this.rect.left += this.direction.x * this.speed;
    this.rect.right += this.direction.x * this.speed;
    this.collision('horizontal')
  }
  
  collision(verb) {
    if (verb === 'horizontal') {
      for (let spriteIndex in this.obstacleSprites) {
        let sprite = this.obstacleSprites[spriteIndex];
        if (sprite.rect.collideRect(this.rect) === true) {
          if (this.direction.x > 0) {
            this.rect.right = sprite.rect.left;
            this.rect.left = this.rect.right - 64; // sprite size
          }
          if (this.direction.x < 0) {
            this.rect.left = sprite.rect.right;
            this.rect.right = this.rect.left + 64; // sprite size
          }
        }
      }
    }

    if (verb === 'vertical') {
      for (let spriteIndex in this.obstacleSprites) {
        let sprite = this.obstacleSprites[spriteIndex];
        if (sprite.rect.collideRect(this.rect) === true) {
          if (this.direction.y > 0) {
            this.rect.bottom = sprite.rect.top;
            this.rect.top = this.rect.bottom - 64; // sprite size
          }
          if (this.direction.y < 0) {
            this.rect.top = sprite.rect.bottom;
            this.rect.bottom = this.rect.top + 64; // sprite size
          }
        }
      }
    }
  }

  update(state) {
    this.move(state.arrow);
    this.draw();
  }
}