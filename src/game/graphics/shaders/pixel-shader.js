import { THREE } from "expo-three";
import { screen } from "../../utils";

export default ({
	pixelSize = 5,
	borderSize = 1,
	lightenFactor = 1.8,
	softenFactor = 0.75,
	darkenFactor = 0.5,
	resolution = new THREE.Vector2(screen.width, screen.height)
} = {}) => {
	const pixelShader = {
		uniforms: {
			tDiffuse: { value: null },
			pixelSize: { value: pixelSize },
			borderFraction: { value: borderSize / pixelSize },
			lightenFactor: { value: lightenFactor },
			softenFactor: { value: softenFactor },
			darkenFactor: { value: darkenFactor },
			resolution: { value: resolution }
		},

		vertexShader: `
			varying highp vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`,

		fragmentShader: `
			uniform sampler2D tDiffuse;
			uniform float pixelSize;
			uniform float borderFraction;
			uniform float lightenFactor;
			uniform float softenFactor;
			uniform float darkenFactor;
			uniform vec2 resolution;

			varying highp vec2 vUv;

			void main(){
				vec2 dxy = pixelSize / resolution;
				vec2 pixel = vUv / dxy;
				vec2 fraction = fract(pixel);
				vec2 coord = dxy * floor(pixel);
				vec3 color = texture2D(tDiffuse, coord).xyz;

				if (fraction.y > (1.0 - borderFraction))
					color = color * lightenFactor;

				if (fraction.x < borderFraction)
					color = color * softenFactor;

				if (fraction.y < borderFraction)
					color = color * darkenFactor;

				gl_FragColor = vec4(color, 1);
			}`
	};

	return pixelShader;
};
