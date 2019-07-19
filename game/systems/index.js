import CameraShake from "./camera-shake";
import CameraControls from "./camera-controls";
import Particles from "./particles";
import Removal from "./removal";
import Rotation from "./rotation";
import Timeline from "./timeline";
import StickController from "../utils/stick-controller";

export default [
	StickController(),
	CameraShake,
	CameraControls(),
	Particles,
	Removal,
	Rotation,
	Timeline
];
