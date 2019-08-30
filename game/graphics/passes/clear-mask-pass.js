import { THREE } from 'expo-three';
import Pass from "./pass";

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ClearMaskPass = function () {

	Pass.call( this );

	this.needsSwap = false;

};

THREE.ClearMaskPass.prototype = Object.create( THREE.Pass.prototype );

Object.assign( THREE.ClearMaskPass.prototype, {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		renderer.state.buffers.stencil.setTest( false );

	}

} );

export default THREE.ClearMaskPass;