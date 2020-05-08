module.exports = class FetchQueue {
  constructor() {
    this.items = [];
    this.platforms = ['reddit', 'imgur'];
    this.waitTimes = new Array(this.platforms.length).fill(0);
  }

  getWait(platform) {
    const { waitTimes, platforms } = this;
    return waitTimes[platforms.indexOf('platform')];
  }

  setWait(platform, val) {
    const { waitTimes, platforms } = this;
    waitTimes[platforms.indexOf('platform')] = val;
  }

  enqueue(item) {
    const { items, platforms, dequeue } = this;
    const { platform, action } = item;
    const inTimestamp = Date.now();
    if (!platform || typeof platform !== typeof String()) {
      return console.error('Invalid platform');
    } else if (platforms.includes(platform)) {
      return console.error('Platform not recognized');
    } else if (!action || typeof action !== typeof Function) {
      return console.error('Invalid action');
    }
    item.inTimestamp = inTimestamp;
    items.push(item);
    if (items.length === 1) {
      dequeue();
    }
  }

  dequeue() {
    const { items, getWait, dequeue } = this;
    const { platform, action } = items[0];
    if (getWait(platform) < Date.now()) {
      items.shift();
      action()
        .then(params => {
          const { requests, time } = params;
          if (requests <= 10) {
            this.setWait(platform, Date.now() + 10000 + time * 1000);
          }
          if (items.length === 1) {
            dequeue();
          }
        }).catch(err => console.error(err));
    } else items.push(items.shift());
  }
};
