export const audio = {
  openWorld: new Howl({
    src: "../../assets/audio/openWorld.wav",
    html5: true
  }),

  initBattle: new Howl({
    src: "../../assets/audio/initBattle.wav",
    html5: true,
    volume: 0.1
  }),

  battle: new Howl({
    src: "../../assets/audio/battle.wav",
    html5: true
  })
};
