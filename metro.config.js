const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;

module.exports = {
  resolver: {
    assetExts: [
      ...defaultAssetExts,
      "glb",
      "fbx",
      "wav",
      "mp3"
    ]
  }
};