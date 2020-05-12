const fs = require('fs');
const path = require('path');

module.exports = class FetchQueue {
  constructor() {
    this.items = [];
    this.knownPlatforms = ['reddit', 'imgur'];
    this.waitTimes = JSON.parse(fs.readFileSync(path.join(__dirname, 'waitTimes.json')));
    this.expiry = 25 * 1000;
    this.offset = 10 * 1000;
  }

  getWait(platforms) {
    return platforms.map(platform =>
      this.waitTimes[this.knownPlatforms.indexOf(platform)]
    );
  }

  setWait(platform, val) {
    this.waitTimes[this.knownPlatforms.indexOf(platform)] = val;
    fs.writeFileSync(path.join(__dirname, 'waitTimes.json'), JSON.stringify(this.waitTimes, null, 2));
  }

  enqueue(item) {
    const { platforms, action } = item;
    const timestamp = Date.now();
    const platformFilter = platforms.filter(platform =>
      !this.knownPlatforms.includes(platform)
    );
    if (platforms.length === 0) {
      return console.error('Requires platform(s)');
    } else if (platformFilter.length !== 0) {
      return console.error('Unrecognized platform:', platformFilter[0]);
    } else if (!action || typeof action !== typeof Function) {
      return console.error('Invalid action');
    }
    item.timestamp = timestamp;
    this.items.push(item);
    if (this.items.length === 1) this.dequeue();
  }

  dequeue() {
    setTimeout(() => {
      const { action, expiry, platforms, timestamp } = this.items[0];
      if (this.getWait(platforms).reduce((a, b) => a > b ? a : b, 0) < Date.now()) {
        this.items.shift();
        action()
          .then(params => {
            params.forEach(param => {
              const { platform, requests, time } = param;
              if (!this.knownPlatforms.includes(platform)) {
                return console.error('Unrecognized platform:', platform);
              }
              if (requests <= 15) {
                this.setWait(platform, Date.now() + this.offset + time);
              }
            });
            if (this.items.length > 0) this.dequeue();
          }).catch(err => console.error(err));
      } else if (Date.now() - timestamp > this.expiry) {
        const time = (this.getWait(platforms).sort((a, b) => b - a)[0]) - Date.now();
        expiry(time);
        this.items.shift();
        if (this.items.length > 0) this.dequeue();
      } else {
        this.items.push(this.items.shift());
        this.dequeue();
      }
    }, 2);
  }
};
