import { THREE } from "expo-three";
import { screen } from "../../utils";

/**
 * @author wongbryan / http://wongbryan.github.io
 *
 * Pixelation shader
 */

export default (pixelSize = 4.0, resolution = new THREE.Vector2(screen.width, screen.height)) => {
	const pixelShader = {
		uniforms: {
			tDiffuse: { value: null },
			pixelSize: { value: pixelSize },
			resolution: { value: resolution }
		},

		vertexShader: [
			"varying highp vec2 vUv;",

			"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
		].join("\n"),

		fragmentShader: [
			"uniform sampler2D tDiffuse;",
			"uniform float pixelSize;",
			"uniform vec2 resolution;",

			"varying highp vec2 vUv;",

			"void main(){",

			"vec2 dxy = pixelSize / resolution;",
			"vec2 coord = dxy * floor( vUv / dxy );",
			"gl_FragColor = texture2D(tDiffuse, coord);",

			"}"
		].join("\n")
	};

	return pixelShader;
};
