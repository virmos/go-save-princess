class UI {
  constructor(config) {
    this.player = config.player;
    this.ctx = config.ctx;

    this.healthBarRect = new Rect(UI_MARGIN, UI_MARGIN, HEALTH_BAR_WIDTH, BAR_HEIGHT);
    this.energyBarRect = new Rect(UI_MARGIN, 42, ENERGY_BAR_WIDTH, BAR_HEIGHT);
    this.weaponBoxBorderColor = UI_BORDER_COLOR;
    this.magicBoxBorderColor = UI_BORDER_COLOR;

    // weapon
    this.weaponImage = new Image();
    this.weaponType = this.player.weaponType;
    this.isWeaponImageLoaded = false;

    // magic
    this.magicImage = new Image();
    this.magicType = this.player.magicType;
    this.isMagicImageLoaded = false;
    this.updateWeaponOverlay(this.weaponType);
    this.updateMagicOverlay(this.magicType);
  }

  showBar(current, maxAmount, rect, color) {
    // border
    this.ctx.fillStyle = UI_BORDER_COLOR;
    this.ctx.fillRect(rect.x - BORDER_SIZE, rect.y - BORDER_SIZE, rect.width + UI_MARGIN, rect.height + UI_MARGIN);

    // background
    this.ctx.fillStyle = UI_BG_COLOR;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    
    // color
    let ratio = current / maxAmount;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(rect.x, rect.y, rect.width * ratio, rect.height);
  }

  showExp(exp) {
    // background
    this.ctx.fillStyle = UI_BG_COLOR;
    this.ctx.fillRect((SCREEN_WIDTH - (100 + UI_MARGIN - BORDER_SIZE)), (SCREEN_HEIGHT - 2 * UI_FONT_SIZE), 100, (UI_FONT_SIZE + UI_FONT_SIZE - (UI_MARGIN - BORDER_SIZE)));
    
    // text
    this.ctx.font = `${UI_FONT_SIZE}px ${UI_FONT}`;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(exp, SCREEN_WIDTH - 100, SCREEN_HEIGHT - UI_FONT_SIZE);
  }

  showSelectionBox(x, y, borderColor) {
    // border
    this.ctx.fillStyle = borderColor;
    this.ctx.fillRect(x  - BORDER_SIZE, y - BORDER_SIZE, ITEM_BOX_SIZE + UI_MARGIN, ITEM_BOX_SIZE + UI_MARGIN);

    // background
    this.ctx.fillStyle = UI_BG_COLOR;
    this.ctx.fillRect(x, y, ITEM_BOX_SIZE, ITEM_BOX_SIZE);
  }

  showWeaponOverlay(x, y) {
    // weapon
    this.isWeaponImageLoaded && this.ctx.drawImage(this.weaponImage,
      0,0,
      this.weaponImage.width,this.weaponImage.height,
      x + (ITEM_BOX_SIZE / 2 - this.weaponImage.width / 2), y,
      this.weaponImage.width, this.weaponImage.height
    )
  }

  showMagicOverlay(x, y) {
    // magic
    this.isMagicImageLoaded && this.ctx.drawImage(this.magicImage,
      0,0,
      this.magicImage.width,this.magicImage.height,
      x + (ITEM_BOX_SIZE / 2 - this.magicImage.width / 2), y,
      this.magicImage.width, this.magicImage.height
    )
  }

  updateWeaponOverlay(weaponType) {
    // weapon
    this.weaponType = weaponType;
    let src = `graphics/weapons/${weaponType}/full.png`;
    this.weaponImage.src = src;
    this.weaponImage.onload = () => {
      this.isWeaponImageLoaded = true;
    }
  }

  updateMagicOverlay(magicType) {
    // magic
    this.magicType = magicType;
    let src = `graphics/particles/${magicType}/${magicType}.png`;
    this.magicImage.src = src;
    this.magicImage.onload = () => {
      this.isMagicImageLoaded = true;
    }
  }

  update() {
    // weapon
    if (this.player.weaponType !==  this.weaponType) {
      this.updateWeaponOverlay(this.player.weaponType);
    }
    if (this.player.canSwitchWeapon === false) {
      this.weaponBoxBorderColor = UI_BORDER_COLOR_ACTIVE;
    } else {
      this.weaponBoxBorderColor = UI_BORDER_COLOR;
    }

    // magic
    if (this.player.magicType !==  this.magicType) {
      this.updateMagicOverlay(this.player.magicType);
    }
    if (this.player.canSwitcMagic === false) {
      this.weaponBoxBorderColor = UI_BORDER_COLOR_ACTIVE;
    } else {
      this.weaponBoxBorderColor = UI_BORDER_COLOR;
    }
  }

  draw() {
    this.showBar(this.player.health, this.player.stats['health'], this.healthBarRect, HEALTH_COLOR);
    this.showBar(this.player.energy, this.player.stats['energy'], this.energyBarRect, ENERGY_COLOR);
    this.showExp(this.player.exp)

    let selectionBoxX1 = UI_MARGIN;
    let selectionBoxY1 = SCREEN_HEIGHT - UI_MARGIN - ITEM_BOX_SIZE;

    let selectionBoxX2 = UI_MARGIN + ITEM_BOX_SIZE + 2 * UI_MARGIN;
    let selectionBoxY2 = SCREEN_HEIGHT - UI_MARGIN - ITEM_BOX_SIZE;

    this.showSelectionBox(selectionBoxX1, selectionBoxY1, this.weaponBoxBorderColor);
    this.showSelectionBox(selectionBoxX2, selectionBoxY2, this.magicBoxBorderColor);
    
    this.showWeaponOverlay(selectionBoxX1, selectionBoxY1);    
    this.showMagicOverlay(selectionBoxX2, selectionBoxY2);   
  }
}