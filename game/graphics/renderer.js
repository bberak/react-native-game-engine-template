import {
  Engine,
  IOfflineProvider,
  Tools,
  Observable,
  IFileRequest,
  WebRequest
} from "babylonjs";
import { resolveAsync } from "expo-asset-utils";
import { readAsStringAsync } from "expo-file-system";
import { decode } from "base64-arraybuffer";

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

/*
const lf = Tools.LoadFile;

Tools.LoadFile = (
  url,
  onSuccess,
  onProgress,
  offlineProvider,
  useArrayBuffer,
  onError
) => {
  console.log("Tools.LoadFile", {
    url,
    onSuccess,
    onProgress,
    offlineProvider,
    useArrayBuffer,
    onError
  });

  if ([".png", ".jpg", ".jpeg", ".gif"].find(ext => url.endsWith(ext)))
    return lf.bind(Tools)(
      url,
      onSuccess,
      onProgress,
      offlineProvider,
      useArrayBuffer,
      onError
    );

  resolveAsync(url)
    .then(asset => readAsStringAsync(asset.localUri, { encoding: "Base64" }))
    .then(decode)
    .then(onSuccess);

    return {
      onCompleteObservable: {
        add: () => { }
      },
      abort: () => { },
    };
};
*/

const Database = (urlToScene, manifedChecked) => {
  console.log("Database", urlToScene);
  manifedChecked(true);

  return {
    IDBStorageEnabled: false,
    enableSceneOffline: () => false,
    enableTexturesOffline: () => false,
    open: successCallback => { console.log("Database.open"); successCallback(); },
    loadImage: (...args) => console.log("Database.loadImage", args),
    loadFile: (url, sceneLoaded, progressCallBack, errorCallback, useArrayBuffer) => {
      console.log("Database.loadFile", { url, sceneLoaded, progressCallBack, errorCallback, useArrayBuffer });
      resolveAsync(url)
        .then(asset => readAsStringAsync(asset.localUri, { encoding: "Base64" }))
        .then(decode)
        .then(sceneLoaded);
    }
  };
};

Engine.OfflineProviderFactory = Database;
Database.IDBStorageEnabled = true;

export default Engine;
