import _ from "lodash";
import { interpolate } from '@popmotion/popcorn';
import { Dimensions } from "react-native";
import * as ThreeUtils from "./three";
import { Audio } from "expo-av";

const remove = (entities, key) => {
	const entity = entities[key];

	if (!entity) 
		return;

	if (entity.model)
		ThreeUtils.remove(entity.model.parent, entity.model);

	if (entity.light)
		ThreeUtils.remove(entity.light.parent, entity.light);

	if (entity.particles) {
		Object.keys(entity.particles).forEach(k => {
			const emitter = entity.particles[k].emitter
			if (emitter)
				ThreeUtils.remove(emitter.parent, emitter);
		})
	}

	if (entity.bodies)
		entity.bodies.forEach(b => b.remove())

	delete entities[key];

	return entities;
};

const any = (arr = [], b = "", c) => {
	if (c) {
		if (Array.isArray(c) === false) c = [c];

		return _.isFunction(b)
			? _.intersection(arr.map(b), c).length > 0
			: _.intersection(arr.map(x => x[b]), c).length > 0;
	}

	if (!b) return arr.length > 0;

	if (Array.isArray(b)) return _.intersection(arr, b).length > 0;

	if (_.isFunction(b)) return arr.find(b);

	return arr.indexOf(b) > -1;
};

const first = (entities, ...predicates) => {
	if (!entities) return;
	if (!predicates || predicates.length < 1) return entities[0];

	if (Array.isArray(entities))
		return entities.find(e => _.every(predicates, p => p(e)))

	return entities[Object.keys(entities).find(key => _.every(predicates, p => p(entities[key])))]
}

const firstKey = (entities, ...predicates) => {
	if (!entities) return;
	if (!predicates || predicates.length < 1) return Object.keys(entities)[0];

	return Object.keys(entities).find(key => _.every(predicates, p => p(entities[key])))
}

const all = (entities, ...predicates) => {
	if (!entities) return;
	if (!predicates || predicates.length < 1) return entities;

	if (Array.isArray(entities))
		return entities.filter(e => _.every(predicates, p => p(e)))

	return Object.keys(entities).filter(key => _.every(predicates, p => p(entities[key]))).map(key => entities[key])
}

const allKeys = (entities, ...predicates) => {
	if (!entities) return;
	if (!predicates || predicates.length < 1) return Object.keys(entities);

	return Object.keys(entities).filter(key => _.every(predicates, p => p(entities[key])));
}

//-- https://stackoverflow.com/a/7616484/138392
const getHashCode = str => {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const positive = val => Math.abs(val)

const negative = val => {
	if (val > 0) return -val
	return val
}

const remap = (n, start1, stop1, start2, stop2) => {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

const constrain = (n, low, high) => {
  return Math.max(Math.min(n, high), low);
}

const between = (n, low, high) => {
  return n > low && n < high
}

const pipe = (...funcs) => _.flow(_.flatten(funcs || []))

const id = (seed = 0) => (prefix = "") => `${prefix}${++seed}`

const cond = (condition, func) => {
	return (args) => {
		const test = _.isFunction(condition) ? condition(args) : condition
		return test ? func(args) : args
	}
}

const log = label => data => {
	console.log(label, data);
	return data;
}

const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1) + min);

const throttle = (func, interval, defaultValue) => {
	let last = 0;
	return (...args) => {
		const current = performance.now();
		if ((current - last) > interval) {
			last = current;
			return func(...args);
		} else {
			return _.isFunction(defaultValue) ? defaultValue(...args) : defaultValue;
		}
	}
}

const screen = Dimensions.get("window");

const createSound = (asset, throttleInterval = 0) => {
	const task = Audio.Sound.createAsync(asset);

	const play = () => {
		Promise.resolve(task).then(({ sound, status }) => {
			if (!status.isPlaying)
				sound.playFromPositionAsync(0)
		});
	};

	return throttleInterval ? throttle(play, throttleInterval) : play;
}

module.exports = {
	remove,
	any,
	find: _.find,
	filter: _.filter,
	first,
	firstKey,
	all,
	allKeys,
	getHashCode,
	positive,
	negative,
	remap,
	constrain,
	clamp: constrain,
	between,
	pipe,
	id,
	cond,
	interpolate,
	log, 
	randomInt,
	once: _.once,
	memoize: _.memoize,
	throttle,
	screen,
	createSound,
	sound: createSound
}