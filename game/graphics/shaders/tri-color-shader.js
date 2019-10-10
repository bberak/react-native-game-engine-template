import { THREE } from "expo-three";

export default ({ distance = 0.005, threshold = 0, colors = [new THREE.Color(0xFFFFFF), new THREE.Color(0x362928), new THREE.Color(0xFF3526)] } = {}) => {
	const triColorShader = {
		uniforms: {
			tDiffuse: { value: null },
			distance: { value: distance },
			threshold: { value: threshold },
			colors: {
				value: colors.map(x => new THREE.Vector4(x.r, x.g, x.b, 1))
			}
		},

		vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}`,

		fragmentShader: `
		uniform sampler2D tDiffuse;
		uniform float distance;
		uniform float threshold;
		uniform vec4 colors[3];
		varying vec2 vUv;

		void main() {
			vec4 tex = texture2D(tDiffuse, vUv);
			vec4 tex2 = texture2D(tDiffuse, vec2(vUv.x + distance, vUv.y));
		
			float test = tex.r + tex.g + tex.b;
			float test2 = tex2.r + tex2.g + tex2.b;
			float diff = test2 - test;

			if(diff < -threshold)
				tex = colors[0];
			else if (diff > threshold)
				tex = colors[1];
			else
				tex = colors[2];

			gl_FragColor = tex;
		}`
	};

	return triColorShader;
};
