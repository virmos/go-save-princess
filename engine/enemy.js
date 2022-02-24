class Enemy extends Entity {
  constructor(config) {
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
    config.overlapY = 0;
    config.animationSpeed = 0.1;

    super(config);

    this.direction = new Vector2D(0, 0);
    this.status = 'idle';
  }

  animate() {
    let animation = this.animations[this.status];
    this.animationIndex += this.animationSpeed;
    if (this.animationIndex >= animation.length)
      this.animationIndex = 0;
    this.image = animation[parseInt(this.animationIndex)];   
  }

  update() {
    this.animate();
  }
}