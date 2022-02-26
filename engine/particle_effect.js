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
      'leaf': [], 
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

  flipFrame() {

  }

  reflectImages(frames) {
    let newFrames = []
    for (let frameIndex in frames) {
      let frame = frames[frameIndex];
      let flippedFrame = this.flipFrame(frame);
      newFrames.push(flippedFrame);
    }
    return newFrames;
  }

  createAttackParticles(x, y, attackType, groups) {
    this.config.x = x;
    this.config.y = y;

    this.config.src = `graphics/particles/${attackType}/0.png`;
    new ParticleEffect(this.config, groups, this.animations[attackType]);
  }

  createGrassParticles(x, y, groups) {
    this.config.x = x;
    this.config.y = y;

    this.config.src = 'graphics/particles/leaf/leaf1_00000.png';
    new ParticleEffect(this.config, groups, this.animations['leaf']);
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