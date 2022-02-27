class AudioPlayer {
  constructor() {
    this.normalHit = './audio/hit.wav';
    this.normalDeath = './audio/death.wav';

    this.attackTracks = {
      'slash': './audio/attack/slash.wav',
      'claw': './audio/attack/claw.wav',
      'fireball': './audio/attack/fireball.wav',
      'weapon': './audio/link/link_sword.wav',
    }

    this.magicTracks = {
      'flame': './audio/fire.wav', 
      'heal': './audio/heal.wav', 
    }

    this.hitTracks = {
      'squid': this.normalHit,
      'raccoon': this.normalHit,
      'spirit': this.normalHit,
      'bamboo': this.normalHit,
      'player': './audio/link/link_hurt.wav',
    }

    this.deathTracks = {
      'squid': this.normalDeath,
      'raccoon': this.normalDeath,
      'spirit': this.normalDeath,
      'bamboo': this.normalDeath,
      'player': './audio/link/link_dies.wav',
    }

    this.themeTracks = {
      'level1': './audio/main.ogg',
    }
    
    this.localAudioCounter = 0;
    this.totalLocalAudio = 12;
    this.loadTracks();
  }
  
  loadTracks() {
    let caller = this;

    this.normalAttack = new Audio('./audio/hit.wav');
    this.normalHit = new Audio('./audio/hit.wav');
    this.normalDeath = new Audio('./audio/death.wav');

    this.normalAttack.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
    this.normalHit.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
    this.normalDeath.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);

    // load attack tracks
    for (const [name, audioSources] of Object.entries(this.attackTracks)) {
      let audio = new Audio(audioSources);
      this.attackTracks[name] = audio;
      audio.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
    }

    // load magic tracks
    for (const [name, audioSources] of Object.entries(this.magicTracks)) {
      let audio = new Audio(audioSources);
      this.magicTracks[name] = audio;
      audio.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);

    }

    // load hit tracks
    // only load for player
    for (const [name, audioSources] of Object.entries(this.hitTracks)) {
      let audio = new Audio(audioSources);
      if (name === 'player') {
        this.hitTracks[name] = audio;
        audio.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
      }
    }

    // load death tracks
    // only load for player
    for (const [name, audioSources] of Object.entries(this.deathTracks)) {
      let audio = new Audio(audioSources);
      if (name === 'player') {
        this.deathTracks[name] = audio;
        audio.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
      }    
    }

    // load theme tracks
    for (const [name, audioSources] of Object.entries(this.themeTracks)) {
      let audio = new Audio(audioSources);
      this.themeTracks[name] = audio;
      audio.addEventListener('canplaythrough', this.finishLoadingTracks.bind(caller), false);
    }
  }

  finishLoadingTracks() {
    this.localAudioCounter += 1;
    if (this.localAudioCounter === this.totalLocalAudio) {
      this.init();
    }
  }

  init() {
    AUDIO_LOADED = true;
  }
}