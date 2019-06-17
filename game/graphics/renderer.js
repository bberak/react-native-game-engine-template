import { Engine, IOfflineProvider, Tools, Observable, IFileRequest } from "babylonjs";
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

//-- https://github.com/BabylonJS/Babylon.js/blob/ea8a810bc385c5c5f26163c6833749a80e223a16/src/Misc/tools.ts

/*
Tools.LoadFile = (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) => {
  console.log("Tools.LoadFile", {
    url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError
  });

  onError();

  return {
      onCompleteObservable: {
        add: () => { }
      },
      abort: () => { },
  };
};
*/

const lf = Tools.LoadFile;

Tools.LoadFile = (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) => {
  console.log("Tools.LoadFile", { url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError });

  if (url.endsWith(".png"))
    return lf.bind(Tools)(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
}

const Database = (urlToScene, manifedChecked) => {
  console.log("Database", urlToScene)
  manifedChecked(true)

  return {
    IDBStorageEnabled  : true,
    enableSceneOffline: () => true,
    enableTexturesOffline: () => true,
    open: successCallback => console.log("Database.open"),
    loadImage: (...args) => console.log("Database.loadImage", args),
    loadFile: (...args) => console.log("Database.loadFile", args)
  };
}

Engine.OfflineProviderFactory = Database;

export default Engine;
