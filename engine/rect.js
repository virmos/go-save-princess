class Rect {
  constructor(config) {
    this.top = config.top;
    this.bottom = config.bottom;
    this.left = config.left;
    this.right = config.right;
  }

  collideRect(otherRect) {
    if (this.left < otherRect.right && this.right > otherRect.left &&
        this.top < otherRect.bottom && this.bottom > otherRect.top) {
          return true;
        }
    return false; 
  }
}