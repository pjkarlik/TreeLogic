import { Howl } from 'howler';

import isoloop from '../../resources/sounds/kraftwerk.mp3';

export const soundAssets = {
  isoloop: {
    src: isoloop,
    type: 'sound',
    volume: 0.5,
    options: {
      loop: true,
    },
    data: null,
  },
};

export default class AssetManager {

  constructor(assets = soundAssets) {
    this.assets = assets;
  }

  getSoundLoader(id, asset) {
    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [asset.src],
        volume: asset.volume,
        ...asset.options,
        onload: () => {
          this.assets[id].data = sound;
          resolve(sound);
        },
        onloaderror: (e) => { reject(e); },
      });
    });
  }

  downloadAll() {
    return Promise.all(
      Object.keys(this.assets)
      .map((id) => (this.getSoundLoader(id, this.assets[id]))));
  }

  getAsset(id) {
    return this.assets[id].data;
  }
}
