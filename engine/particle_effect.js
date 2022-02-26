class ParticleEffect extends AnimationSprite {
  constructor() {
    //Set up the image
    config.src = `graphics/particles/${config.spriteType}/0.png`;
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
  }

  animate() {
    let animation = this.animations[this.status];
    this.animationIndex += this.animationSpeed;
    if (this.animationIndex >= animation.length)
      this.delete();
    else 
      this.image = animation[parseInt(this.animationIndex)];   
  }

  update() {
    this.animate();
  }
}