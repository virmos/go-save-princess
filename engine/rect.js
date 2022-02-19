class Rect {
  constructor(config) {
    this.top = config.top;
    this.bottom = config.bottom;
    this.left = config.left;
    this.right = config.right;

    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
  }

  update(config) {
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

  inflate(overlapX, overlapY) {
    return { top: this.top - overlapY, bottom: this.bottom + overlapY,
                      left: this.left - overlapX, right: this.right + overlapX };
  }

  deflate(overlapX, overlapY) {
    return { top: this.top + overlapY, bottom: this.bottom - overlapY,
                      left: this.left + overlapX, right: this.right - overlapX };
  }
}