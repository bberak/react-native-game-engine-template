import { PerspectiveCamera } from "three";
import { screen } from "../utils";

export default (Camera = () => {
	const camera = new PerspectiveCamera(
		120,
		screen.width / screen.height,
		1,
		1000
	);

	const lookAt = camera.lookAt;

	//-- Overriding the lookAt function so I always
	//-- have a quick reference to the lookAt vector
	camera.lookAt = vec => {
		lookAt.apply(camera, [vec]);
		camera.target = vec;
	};

	return camera;
});
