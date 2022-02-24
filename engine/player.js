class Player extends AnimationSprites {
  constructor(config, createWeapon, destroyWeapon, createMagic, destroyMagic) {
    //Set up the image
    config.src = "graphics/test/player.png";
    config.animationSprites = player_animation_sprites;
    config.totalAnimationSprites = num_player_animation_sprites;
    super(config);

    // movements
    this.direction = new Vector2D(0, 0);
    this.status = 'down';
    this.isAttacking = false;
    this.canAttack = true;
    this.attackCooldownTimeout = 400;

    // weapons
    this.weaponIndex = 2;
    this.weaponType = Object.keys(weapon_data)[this.weaponIndex];
    this.afterAttackCooldownTimeout = weapon_data[this.weaponType]['cooldown'];
    this.weaponDirection = 'down';
    this.createWeapon = createWeapon;
    this.destroyWeapon = destroyWeapon;

    // switch weapons
    this.switchWeaponCooldownTimeout = 200;
    this.canSwitchWeapon = true;

    // magic
    this.magicIndex = 0;
    this.magicType = Object.keys(magic_data)[this.magicIndex];
    this.afterAttackCooldownTimeout = 200;
    this.magicDirection = 'down';
    this.createMagic = createMagic;
    this.destroyMagic = destroyMagic;

    // switch magics
    this.switchMagicCooldownTimeout = 200;
    this.canSwitchMagic = true;

    // stats
    this.stats = {'health': 100, 'energy': 60, 'attack': 10, 'magic': 4, 'speed': 5};
    this.health = this.stats['health'];
    this.energy = this.stats['energy'];
    this.speed = this.stats['speed'];
    this.exp = 110;
  }

  addCollision(obstacleSprites) {
    this.obstacleSprites = obstacleSprites;
  }

  input(arrow) {
    if (this.isAttacking) {
      arrow = null;
    }

    if (!arrow) {
      this.direction.x = 0;
      this.direction.y = 0;
    }

    if (arrow === 'up') {
      this.direction.y = -1;
      this.status = 'up';
    }  else if (arrow === 'down') {
      this.direction.y = 1;
      this.status = 'down';
    }  

    if (arrow === 'left') {
      this.direction.x = -1;
      this.status = 'left';
    }  else if (arrow === 'right') {
      this.direction.x = 1;
      this.status = 'right';
    } 
    
    if (this.direction.magnitude() != 0) {
      this.direction.normalize();
    }

    if (arrow ===  'enter'&& this.canAttack) {
      this.weaponDirection = this.status.split('_')[0];
      this.isAttacking = true;
      this.canAttack = false;
      this.createWeapon(this);
      setTimeout(this.attackWeaponCooldown.bind(this), this.attackCooldownTimeout);
    }

    if (arrow === 'space' && this.canAttack) {
      this.magicDirection = this.status.split('_')[0];
      this.isAttacking = true;
      this.canAttack = false;
      this.createMagic(this);
      setTimeout(this.attackMagicCooldown.bind(this), this.attackCooldownTimeout);
    }

    if (arrow === 'q' && !this.isAttacking) {
      if (this.canSwitchWeapon) {
        let weaponArray = Object.keys(weapon_data);
        this.weaponIndex = (this.weaponIndex >= weaponArray.length - 1) ? 0 : this.weaponIndex + 1;
        this.weaponType = weaponArray[this.weaponIndex];
        this.afterAttackCooldownTimeout = weapon_data[this.weaponType]['cooldown'];
        setTimeout(this.switchWeaponCooldown.bind(this), this.switchWeaponCooldownTimeout);
      }
      this.canSwitchWeapon = false;
    }

    if (arrow === 'e' && !this.isAttacking) {
      if (this.canSwitchMagic) {
        let magicArray = Object.keys(magic_data);
        this.magicIndex = (this.magicIndex >= magicArray.length - 1) ? 0 : this.magicIndex + 1;
        this.magicType = magicArray[this.magicIndex];
        setTimeout(this.switchMagicCooldown.bind(this), this.switchMagicCooldownTimeout);
      }
      this.canSwitchMagic = false;
    }
  }

  getStatus() {
    if (this.direction.x === 0 && this.direction.y === 0) {
      if (this.status.indexOf('_idle') === -1 && this.status.indexOf('_attack') === -1) {
        this.status = this.status.concat('_idle');
      }
    }
      
    if (this.isAttacking) {
      if (this.status.indexOf('_attack') === -1) {
        if (this.status.indexOf('_idle') !== -1)
          this.status = this.status.replace('_idle', '_attack');
        else 
          this.status= this.status.concat('_attack');
      }
    }
    else {
      this.status = this.status.replace('_attack', '');
    }
  }

  animate() {
    let animation = this.animations[this.status];
    this.animationIndex += this.animationSpeed;
    if (this.animationIndex >= animation.length)
      this.animationIndex = 0;
    this.image = animation[parseInt(this.animationIndex)];   
  }

  switchWeaponCooldown() {
    this.canSwitchWeapon = true;
  }

  switchMagicCooldown() {
    this.canSwitchMagic = true;
  }

  attackWeaponCooldown() {
    this.isAttacking = false;
    this.destroyWeapon();
    setTimeout(this.afterAttackCooldown.bind(this), this.afterAttackCooldownTimeout);
  }

  attackMagicCooldown() {
    this.isAttacking = false;
    this.destroyMagic();
    setTimeout(this.afterAttackCooldown.bind(this), this.afterAttackCooldownTimeout);
  }

  afterAttackCooldown() {
    this.canAttack = true;
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
    this.getStatus();
    this.animate();
    this.move();
  }
}