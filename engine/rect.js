class Rect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    this.update();
  }

  collideRect(otherRect) {
    if (this.left < otherRect.right && this.right > otherRect.left &&
        this.top < otherRect.bottom && this.bottom > otherRect.top) {
          return true;
        }
    return false; 
  }

  update() {
    this.top = this.y;
    this.bottom = this.y + 64;
    this.left = this.x;
    this.right = this.x + 64;
  }
}