module.exports = class FetchQueue {
  constructor() {
    this.items = [];
    this.knownPlatforms = ['reddit', 'imgur'];
    this.waitTimes = new Array(this.knownPlatforms.length).fill(0);
    this.expiry = 3 * 60 * 1000;
    this.offset = 10 * 1000;
  }

  getWait(platforms) {
    return platforms.map(platform =>
      this.waitTimes[this.knownPlatforms.indexOf(platform)]
    );
  }

  setWait(platform, val) {
    this.waitTimes[this.knownPlatforms.indexOf(platform)] = val;
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
    if (this.items.length === 1) {
      this.dequeue();
    }
  }

  dequeue() {
    setTimeout(() => {
      const { platforms, action, timestamp } = this.items[0];
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
            if (this.items.length >= 1) {
              this.dequeue();
            }
          }).catch(err => console.error(err));
      } else if (Date.now() - timestamp > this.expiry) {
        this.items.shift();
        this.dequeue();
      } else {
        console.error('Expired');
        this.items.push(this.items.shift());
        this.dequeue();
      }
    }, 2);
  }
};
