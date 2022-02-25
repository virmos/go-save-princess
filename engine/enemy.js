class Enemy extends Entity {
  constructor(config, groups, obstacleSprites) {
    // setup the animations
    config.animations = {
      'idle': [],
      'move': [],
      'attack': [],
    }
    if (config.spriteType === 'bamboo') { 
      config.src = `graphics/monsters/bamboo/idle/0.png`;
      config.animationSprites = bamboo_animation_sprites;
      config.totalAnimationSprites = num_bamboo_animation_sprites;
    }
    else if (config.spriteType === 'spirit') { 
      config.src = `graphics/monsters/spirit/idle/0.png`;
      config.animationSprites = spirit_animation_sprites;
      config.totalAnimationSprites = num_spirit_animation_sprites;
    }
    else if (config.spriteType === 'raccoon') { 
      config.src = `graphics/monsters/raccoon/idle/0.png`;
      config.animationSprites = raccoon_animation_sprites;
      config.totalAnimationSprites = num_raccoon_animation_sprites;
    }
    else if (config.spriteType === 'squid') { 
      config.src = `graphics/monsters/squid/idle/0.png`;
      config.animationSprites = squid_animation_sprites;
      config.totalAnimationSprites = num_squid_animation_sprites;
    }

    config.overlapX = 0;
    config.overlapY = 26;
    config.animationSpeed = 0.1;

    super(config, groups, obstacleSprites);

    // movements
    this.direction = new Vector2D(0, 0);
    this.updatedDirection = new Vector2D(0, 0);
    this.status = 'idle';

    // stats  
    let monsterInfo = monster_data[this.spriteType];
    this.health = monsterInfo['health'];
    this.exp = monsterInfo['exp'];
    this.speed = monsterInfo['speed'];
    this.damage = monsterInfo['damage'];
    this.attackRadius = monsterInfo['attack_radius'];
    this.noticeRadius = monsterInfo['notice_radius'];
    this.attackType = monsterInfo['attack_type'];
    this.attackCooldownTimeout = monsterInfo['attack_cooldown'];
    this.invincibleTimeout = 200;

    // states
    this.canAttack = true;
    this.isAttacking = false;

    this.canBeAttacked = true;
  }

  calculateMovementVector() {
    let playerVecX = this.player.centerX;
    let playerVecY = this.player.centerY;

    let monsterVecX = this.centerX;
    let monsterVecY = this.centerY;

    let directionVecX = playerVecX - monsterVecX;
    let directionVecY = playerVecY - monsterVecY;
    
    let squareDistance =  directionVecX * directionVecX + directionVecY * directionVecY;
    let distance = Math.sqrt(squareDistance)
    
    this.updatedDirection.x = directionVecX;
    this.updatedDirection.y = directionVecY;
    this.updatedDirection.normalize();
    
    return distance;
  }

  getStatus() {
    let distance = this.calculateMovementVector();

    if (!this.isAttacking) {
      this.status = 'idle';
      if (distance <= this.attackRadius && this.canAttack) {
        this.status = 'attack';
      } else if (distance > this.attackRadius && distance <= this.noticeRadius) {
        this.status = 'move';
      }
    }
  }

  action() {
    this.direction.x = 0;
    this.direction.y = 0;
    if (this.status === 'attack') {
      if (!this.isAttacking) {
        this.animationIndex = 0;
        this.isAttacking = true;
      }
    } else if (this.status === 'move') {
      this.direction.x = this.updatedDirection.x;
      this.direction.y = this.updatedDirection.y;
    } else if (this.status === 'idle') {

    }
  }

  animate() {
    let animation = this.animations[this.status];
    this.animationIndex += this.animationSpeed;
    if (this.animationIndex >= animation.length) {
      this.animationIndex = 0;
      if (this.status === 'attack') {
        this.canAttack = false;
        this.isAttacking = false;
        setTimeout(this.attackCooldown.bind(this), this.attackCooldownTimeout);
      }
    }
    this.image = animation[parseInt(0)];   
  }

  attackCooldown() {
    this.canAttack = true;
  } 
  
  invincibleCooldown() {
    this.canBeAttacked = true;
  }

  collideSprite(other) {
    return this.rect.collideRect(other.rect);
  }

  takeDamage() {
    if (this.canBeAttacked) {
      this.canBeAttacked = false;
      this.health -= this.player.getFullWeaponDamage();

      this.ctx.globalAlpha = 0.5;
      this.ctx.drawImage(this.image, this.x, this.y);
      this.ctx.globalAlpha = 1.0;

      this.image.className = 'object-flickering';

      if (this.health <= 0)
        this.delete();
      setTimeout(this.invincibleCooldown.bind(this), this.invincibleTimeout);
    }
  }

  update() {
    this.getStatus();
    this.action();
    this.move();
    this.animate();
  }
}