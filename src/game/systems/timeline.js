import { all } from "../utils";
import _ from "lodash";

const start = (timeline, args) => {
  if (!timeline.start) timeline.start = args.time.current;
};

const update = (entity, entities, key, timeline, args) => {
  const time = args.time;

  if (timeline.duration) {
    let percent = (time.current - timeline.start) / timeline.duration;

    if (percent <= 1) {
      timeline.update(entity, entities, percent, timeline, args);
    } else {
      if (timeline.complete)
        timeline.complete(entity, entities, timeline, args);

      delete entity.timelines[key];
    }
  }

  if (timeline.while) {
    if (
      _.isFunction(timeline.while)
        ? timeline.while(entity, entities, timeline, args)
        : true
    ) {
      timeline.update(entity, entities, timeline, args);
    } else {
      if (timeline.complete)
        timeline.complete(entity, entities, timeline, args);

      delete entity.timelines[key];
    }
  }
};

const Timeline = (entities, args) => {
  const entitiesWithTimelines = all(entities, e => e.timelines);

  for (let i = 0; i < entitiesWithTimelines.length; i++) {
    const entity = entitiesWithTimelines[i];
    const keys = Object.keys(entity.timelines);

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const timeline = entity.timelines[key];

      if (timeline) {
        start(timeline, args);
        update(entity, entities, key, timeline, args);
      }
    }
  }

  return entities;
};

export default Timeline;
