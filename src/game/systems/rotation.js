import { all } from "../utils";
import _ from "lodash";

const Rotation = (entities, args) => {
	const rotatables = all(entities, e => e.rotation, e => e.model);

	for (let i = 0; i < rotatables.length; i++) {
		const r = rotatables[i];

		if (r.model.cellIndex !== undefined) {
			r.model.angle = _.isFunction(r.rotation)
				? r.rotation(r, entities, args)
				: r.model.angle + r.rotation;
		} else {
			r.model.rotation.z = r.rotation.z
				? _.isFunction(r.rotation.z)
					? r.rotation.z(r, entities, args)
					: r.model.rotation.z + r.rotation.z
				: r.model.rotation.z;
			r.model.rotation.x = r.rotation.x
				? _.isFunction(r.rotation.x)
					? r.rotation.x(r, entities, args)
					: r.model.rotation.x + r.rotation.x
				: r.model.rotation.x;
			r.model.rotation.y = r.rotation.y
				? _.isFunction(r.rotation.y)
					? r.rotation.y(r, entities, args)
					: r.model.rotation.y + r.rotation.y
				: r.model.rotation.y;
		}
	}

	return entities;
};

export default Rotation;
