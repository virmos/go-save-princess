class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.top = y;
    this.bottom = y + height;
    this.left = x;
    this.right = x + width;

    this.width = width;
    this.height = height;
  }

  update(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.top = y;
    this.bottom = y + height;
    this.left = x;
    this.right = x + width;

    this.x = this.left;
    this.y = this.top;
  }

  collideRect(otherRect) {
    if (this.left < otherRect.right && this.right > otherRect.left &&
        this.top < otherRect.bottom && this.bottom > otherRect.top) {
          return true;
        }
    return false; 
  }

  inflate(overlapX, overlapY) {
    let x = this.left + overlapX;
    let y = this.top + overlapY;
    let width = this.width - 2 * overlapX; 
    let height = this.height - 2 * overlapY; 
    
    return { x: x, y:y, width: width, height: height };
  }

  deflate(overlapX, overlapY) {
    let x = this.left - overlapX;
    let y = this.top - overlapY;
    let width = this.width + 2 * overlapX; 
    let height = this.height + 2 * overlapY; 
    return { x: x, y:y, width: width, height: height };
  }
}