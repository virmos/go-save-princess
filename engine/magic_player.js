class MagicPlayer {
  constructor(animationPlayer) {
    this.animationPlayer = animationPlayer;
  }

  heal(player, strength, cost, groups) {
    if (player.energy >= cost) {
      player.health += strength;
      player.energy -= cost;

      if (player.health >= player.stats['health']) {
        player.health = player.stats['health'];
      } 
      this.animationPlayer.createMagicParticles(player.x - 15, player.y, 'aura', groups); // hardcoded for link
      this.animationPlayer.createMagicParticles(player.x, player.y - TILE_SIZE, 'heal', groups); // hardcoded for link
    }
  }

  flame(player, cost, groups) {
    if (player.energy >= cost) {
      player.energy -= cost;
      
      let playerDirection = player.status.split('_')[0];
      let directionX = 0;
      let directionY = 0;
      if (playerDirection === 'right')
        directionX = 1;
      else if (playerDirection === 'left')
        directionX = -1;
        
      if (playerDirection === 'up')
        directionY = -1;
      else if (playerDirection === 'down')
        directionY = 1;

      let offsetX, offsetY, x, y;

      if (directionX !== 0) {
        for (let i = 1; i <= 7; i++) {
          offsetX = directionX * i * TILE_SIZE;
          x = player.centerX + offsetX;
          y = player.centerY + Math.random() * TILE_SIZE - TILE_SIZE / 2;
          this.animationPlayer.createMagicParticles(x, y, 'flame', groups); // hardcoded for link
        }
      } else if (directionY !== 0) {
        for (let i = 1; i <= 7; i++) {
          offsetY = directionY * i * TILE_SIZE;
          x = player.centerX + Math.random() * TILE_SIZE - TILE_SIZE / 2;
          y = player.centerY + offsetY;
          this.animationPlayer.createMagicParticles(x, y, 'flame', groups); // hardcoded for link
        }
      }
    }
  }
}