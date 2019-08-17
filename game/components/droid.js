import ExpoTHREE, { THREE } from "expo-three";
import Mixer from "./mixer";
import { firstMesh } from "../utils/three";
import { between } from "../utils";
import * as OIMO from "oimo";
import _ from "lodash"

const mesh = ExpoTHREE.loadAsync(
	require("../../assets/models/droid.fbx")
);

export default async ({ parent, world, x = 0, y = 0, z = 0}) => {

	const mixer = await Mixer({ parent, x, y, z, mesh, scale: 0.0035 })
	const model = mixer.model;
	const box = new THREE.Box3();

	box.setFromObject(model);

	const longest = _.max([box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z])

	mixer.body = world.add({ 
	    type: "sphere",
	    size: [longest, longest, longest],
	    pos: [model.position.x, model.position.y, model.position.z],
	    rot: [0, 0, 0],
	    move: true,
	    density: 1,
	    friction: 0.2,
	    restitution: 0.2,
	    belongsTo: 1,
	    collidesWith: 0xffffffff
	});

	return mixer;
};
