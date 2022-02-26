class Player extends AnimationSprite {
  constructor(config, groups, obstacleSprites, createWeapon, destroyWeapon, createMagic, destroyMagic) {
    //Set up the image
    config.spriteType = 'player';
    config.src = `graphics/${config.spriteType}/down/down_0.png`;
    config.animationSprites = player_animation_sprites;
    config.totalAnimationSprites = num_player_animation_sprites;
    config.animations = {
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
    config.animationSpeed = 0.24;
    config.overlapX = 10;
    config.overlapY = 26,
    super(config, groups, obstacleSprites);
    this.animationIndex = 0;

    // movements
    this.direction = new Vector2D(0, 0);
    this.status = 'down';

    // weapons
    this.weaponIndex = 2;
    this.weaponType = Object.keys(weapon_data)[this.weaponIndex];
    this.weaponCooldownTimeout = weapon_data[this.weaponType]['cooldown'];
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
    this.attackDamage = this.stats['attack'];
    this.health = this.stats['health'];
    this.energy = this.stats['energy'];
    this.speed = this.stats['speed'];
    this.exp = 110;

    // states
    this.isAttacking = false;
    this.canAttack = true;
    this.attackCooldownTimeout = 200;

    this.invincibleTimeout = 500;
    this.canBeAttacked = true;
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
    
    this.direction.normalize();

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
        this.weaponCooldownTimeout = weapon_data[this.weaponType]['cooldown'];
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
    setTimeout(this.afterAttackCooldown.bind(this), this.afterAttackCooldownTimeout + this.weaponCooldownTimeout);
  }

  attackMagicCooldown() {
    this.isAttacking = false;
    this.destroyMagic();
    setTimeout(this.afterAttackCooldown.bind(this), this.afterAttackCooldownTimeout);
  }

  afterAttackCooldown() {
    this.canAttack = true;
  }

  getFullWeaponDamage() {
    let weaponDamage = weapon_data[this.weaponType]['damage'];
    return this.attackDamage + weaponDamage;
  }
  
  invincibleCooldown() {
    this.canBeAttacked = true;
    this.globalAlpha = 1.0;
  }

  takeDamage() {
    if (this.canBeAttacked) {
      this.canBeAttacked = false;

      if (this.health <= 0) {
        this.delete();
      }

      this.globalAlpha = 0.3;
      setTimeout(this.invincibleCooldown.bind(this), this.invincibleTimeout);
    }
  }

  update(state) {
    this.input(state.arrow);
    this.getStatus();
    this.move();
    this.animate();
  }
}