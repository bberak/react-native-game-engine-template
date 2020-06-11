import { StyleSheet, Platform } from "react-native";
import { DefaultTimer } from "react-native-game-engine";

const ideal = 1000 / 60;

class PerfTimer {
  constructor() {
    this.subscribers = [];
    this.loopId = null;
    this.last = 0;
  }

  loop = time => {
    if (this.loopId) {
      this.subscribers.forEach(callback => {
        callback(time);
      });    
    }

    const now = new Date().getTime();
    const delay = ideal - (now - this.last)

    this.loopId = setTimeout(this.loop, delay > 0 ? delay : 0, now);
    this.last = now;
  };

  start() {
    if (!this.loopId) {
      this.loop();
    }
  }

  stop() {
    if (this.loopId) {
      clearTimeout(this.loopId);
      this.loopId = null;
    }
  }

  subscribe(callback) {
    if (this.subscribers.indexOf(callback) === -1)
      this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(s => s !== callback)
  }
}

export default (Platform.OS === "android" ? PerfTimer : DefaultTimer)