import { THREE } from "expo-three";

export default (thickness = 5.0, color = new THREE.Vector4(0, 0, 0, 1)) => {
	const scanlineShader = {
		uniforms: {
			tDiffuse: { value: null },
			thickness: { value: thickness },
			color: { value: color }
		},

		vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}`,

		fragmentShader: `
		uniform sampler2D tDiffuse;
		uniform float thickness;
		uniform vec4 color;
		varying vec2 vUv;
		void main() {
			float result = floor(mod(gl_FragCoord.y, thickness));
			gl_FragColor = result == 0.0 ? texture2D(tDiffuse, vUv) : color;
		}`
	};

	return scanlineShader;
};
