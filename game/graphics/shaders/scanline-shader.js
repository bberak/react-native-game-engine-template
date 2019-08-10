import { THREE } from 'expo-three';

THREE.ScanlineShader = {
	uniforms: {
		tDiffuse: { value: null },
		thickness: { value: 5.0 },
		color: { value: new THREE.Vector4(0, 0, 0, 1) }
	},

	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,

	fragmentShader: `
		const vec4 blank = vec4(0.0, 0.0, 0.0, 1.0);
		uniform sampler2D tDiffuse;
		uniform float thickness;
		uniform vec4 color;
		varying vec2 vUv;
		void main() {
			float result = floor(mod(gl_FragCoord.y, thickness));
			gl_FragColor = result == 0.0 ? texture2D(tDiffuse, vUv) : color;
		}
	`
};

export default THREE.ScanlineShader;

