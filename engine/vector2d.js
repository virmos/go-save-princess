class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    if (this.x * this.x + this.y * this.y >= 2) {
      return true;
    }
    return false;
  }

  normalize() {
    if (this.y !== 0) {
      console.log('before: ', this.x, this.y)
      let root = Math.sqrt((this.x * this.x + this.y * this.y));
      this.x = this.x * 1.0 / root;
      this.y = this.y * 1.0 / root;
      console.log('after: ', this.x, this.y)
    }
  }
}