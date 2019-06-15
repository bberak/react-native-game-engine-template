import { Engine } from "babylonjs";
import { resolveAsync } from "expo-asset-utils";

global.HTMLElement = () => false;
global.HTMLImageElement = () => false;
global.Image = () => ({
  addEventListener(...args) {
    console.log("Image.addEventListener - I should not get here..", args);
  },
  removeEventListener(...args) {
    console.log("Image.removeEventListener - I should not get here..", args);
  }
});

const textureLoader = {
  canLoad: () => true,
  transformUrl: url => url,
  loadData: (data, texture, cb) => {
    resolveAsync(texture.url).then(asset => {
      const gl = texture._engine._gl;
      cb(asset.width, asset.height, texture.generateMipMaps, false, () => {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          asset.width,
          asset.height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          asset
        );
      });
    });
  }
};

Engine._TextureLoaders.push(textureLoader);

export default Engine;
