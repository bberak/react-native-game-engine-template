import ExpoTHREE from "expo-three";
import AnimatedModel from "./animated-model";
import _ from "lodash"

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/droid.fbx")
);

export default async ({ parent, x = 0, y = 0, z = 0}) => {

	const animated = await AnimatedModel({ parent, x, y, z, mesh, scale: 0.0035 })

	return animated;
};
