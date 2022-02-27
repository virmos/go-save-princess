class AnimationPlayer {
  constructor(config, groups) {
    //Set up the image
    this.animationSprites = particle_effect_sprites;
    this.totalAnimationSprites = num_particle_effect_sprites;
    this.animations = {
      'aura': [],
      'flame': [], 
      'heal':[],
      'claw': [], 
      'leaf_attack': [],
      'slash': [],
      'sparkle': [],
      'thunder': [],
      'leaf1': [], 
      'leaf2': [], 
      'leaf6': [], 
      'bamboo': [], 
      'spirit': [],
      'raccoon': [],
      'squid': [],
    }
    this.loadAnimationSprites();
    this.config = config;
    this.groups = groups;
  }
  
  loadAnimationSprites() {
    let caller = this;
    for (const [animationName, animationSources] of Object.entries(this.animationSprites)) {
      for (let sourceIndex in animationSources) {
        let animationImage = new Image();
        animationImage.src = animationSources[sourceIndex];
        animationImage.onload = this.finishLoadingAnimationSprites.bind(caller, animationName, animationImage);
      }
    }
  }

  finishLoadingAnimationSprites(animationName, animationImage) {
    this.animations[animationName].push(animationImage);
    this.localSpriteCounter += 1;
    if (this.localSpriteCounter === this.totalLocalSprites) {
      this.init();
    }
  }

  init() {
    SPRITE_COUNTER += 1;
    this.groups.forEach(group => group.push(this));
  }

  createDeathParticles(x, y, spriteType, groups) {
    this.config.x = x;
    this.config.y = y;

    let defaultSprite = spriteType;
    if (spriteType === 'squid') {
      defaultSprite = 'smoke_orange';
    } else if (spriteType === 'spirit') {
      defaultSprite = 'nova';
    }

    this.config.src = `graphics/particles/${defaultSprite}/0.png`;
    new ParticleEffect(this.config, groups, this.animations[spriteType]);
  }

  createAttackParticles(x, y, attackType, groups) {
    this.config.x = x;
    this.config.y = y;

    this.config.src = `graphics/particles/${attackType}/0.png`;
    new ParticleEffect(this.config, groups, this.animations[attackType]);
  }

  createMagicParticles(x, y, magicType, groups) {
    this.config.x = x;
    this.config.y = y;

    let append = '/frames'
    if (magicType === 'aura') {
      append = ''
    }

    this.config.src = `graphics/particles/${magicType}${append}/0.png`;
    this.config.spriteType = 'magic';
    new ParticleEffect(this.config, groups, this.animations[magicType]);
  }

  createGrassParticles(x, y, leafNumber, groups) {
    this.config.x = x;
    this.config.y = y;

    this.config.src = `graphics/particles/leaf${leafNumber}/leaf1_00000.png`;
    new ParticleEffect(this.config, groups, this.animations[`leaf${leafNumber}`]);
  }
}

class ParticleEffect extends Sprite {
  constructor(config, groups, animation) {
    config.animationSpeed = 0.15;
    super(config, groups);
    this.animation = animation;
  }

  animate() {
    this.animationIndex += this.animationSpeed;
    if (this.animationIndex >= this.animation.length) {
      this.animationIndex = 0;
      this.delete();
    }
    else 
      this.image = this.animation[parseInt(this.animationIndex)];   
  }

  update() {
    this.animate();
  }
}