class Sprites {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    this.ctx = config.ctx;

    this.rect = new Rect(config.x, config.y)
    // 64 is sprite size
  }

  draw() {
    
    this.isLoaded && this.ctx.drawImage(this.image,
      0,0,
      64,64,
      this.rect.x, this.rect.y,
      64,64
    )
  }

  update() {
    this.draw();
  }
}