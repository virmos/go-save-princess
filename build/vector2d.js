class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    let square = this.x * this.x + this.y * this.y;
    if (square >= 2) {
      let root = Math.sqrt(square);
      this.x = this.x * 1.0 / root;
      this.y = this.y * 1.0 / root;
    }
  }
}