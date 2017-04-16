export default class Branch {
  constructor(parent, level, maxLevels, x, y, surface) {
    this.parent = parent;
    this.surface = surface;
    this.branches = [];
    this.p0 = parent ? parent.p1 : { x, y };
    this.p1 = { x, y };
    this.level = level;
    this.maxLevels = maxLevels;
    this.date = new Date();
    this.hue = ~(this.date.getSeconds() * 10);
    this.life = 13;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.mult = 4;
  }

  distance = (a, b, c, d) => {
    const radius = Math.sqrt(((a - c) * (a - c) + (b - d) * (b - d)));
    return radius;
  };

  getRandomPoint = (radius) => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle,
    };
  };

  newBranch = (parent) => {
    const branch = new Branch(parent, parent.level - 1, this.maxLevels, parent.p1.x, parent.p1.y, this.surface);
    branch.angle = (parent.level === this.maxLevels) ? Math.random() * 4 * Math.PI : Math.atan2(
      parent.p1.y - parent.p0.y,
      parent.p1.x - parent.p0.x
    ) + (Math.random() * 1.5 - 0.75);

    branch.vx = Math.cos(branch.angle) * this.mult;
    branch.vy = Math.sin(branch.angle) * this.mult;
    branch.life = branch.level === 1 ? this.mult : Math.round(Math.random() * (branch.level * 6)) + 3;
    return branch;
  };

  grow = () => {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].grow();
    }

    if (this.life > 1) {
      this.p1.x += this.vx;
      this.p1.y += this.vy;

      const lineWidth = 0.5;
      const hue = `hsl(${this.hue},100%,50%)`;
      // const radius = ~~(this.distance(this.p0.x, this.p0.y, this.p1.x, this.p1.y));
      const size = ~~((this.life * 0.2));
      this.surface.beginPath();
      if (this.level) {
        this.surface.lineWidth = lineWidth;
        this.surface.fillStyle = hue;
        if (this.parent) {
          this.surface.moveTo(this.p1.x, this.p1.y);
          // this.surface.arc(this.p0.x, this.p0.y, radius * 0.4, 0, 2 * Math.PI, false);
          this.surface.arc(this.p1.x, this.p1.y, size, 0, 2 * Math.PI, false);
        }
        this.surface.fill();
      }
    }
    if (this.life === 1 && this.level > 0 && this.level < this.maxLevels) {
      this.branches.push(this.newBranch(this));
      this.branches.push(this.newBranch(this));
      if (Math.random() > 0.5 && this.level < 4) {
        this.branches.push(this.newBranch(this));
      }
    }
    if (Math.random() > 0.7) {
      this.angle = Math.atan2(
        this.p1.y - this.p0.y,
        this.p1.x - this.p0.x
      ) + (Math.random() * 0.75 - 0.35);
      this.vx = Math.cos(this.angle) * 3;
      this.vy = Math.sin(this.angle) * 3;
    }
    this.life --;
  };
}
