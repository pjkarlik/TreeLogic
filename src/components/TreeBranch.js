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
    this.life = 10;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.mult = 10;
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

  sproutLeaves = (p0, p1, amt) => {
    this.surface.lineWidth = 3;
    const radius = ~~(this.distance(p0.x, p0.y, p1.x, p1.y));
    for (let i = 0; i < amt; i++) {
      const hue = `hsla(${this.hue + (i * 20)},100%,50%,0.75)`;
      const rndPoint = this.getRandomPoint(radius);
      this.surface.fillStyle = hue;
      this.surface.moveTo(p0.x + rndPoint.x + radius, this.parent.p0.y);
      this.surface.arc(p0.x + rndPoint.x, p0.y + rndPoint.y, radius * 0.35, 0, 2 * Math.PI, false);
      this.surface.fill();
    }
  }

  newBranch = (parent) => {
    const branch = new Branch(parent,
      parent.level - 1, this.maxLevels, parent.p1.x, parent.p1.y, this.surface);
    branch.angle = (parent.level === this.maxLevels) ? (-89.5) + ~~(0.25 - Math.random() * 0.5) : Math.atan2(
      parent.p1.y - parent.p0.y,
      parent.p1.x - parent.p0.x
    ) + (Math.random() * 1.0 - 0.5);

    branch.vx = Math.cos(branch.angle) * this.mult;
    branch.vy = Math.sin(branch.angle) * this.mult;

    branch.life = branch.level === 1 ? this.mult : Math.round(Math.random() * (branch.level * 2)) + 3;
    return branch;
  };

  grow = () => {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].grow();
    }

    if (this.life > 1) {
      this.p1.x += this.vx;
      this.p1.y += this.vy;
      this.surface.beginPath();
      this.surface.lineCap = 'round';
      const lineWidth = this.level * 5 - 4;
      if (this.level) {
        this.surface.lineWidth = lineWidth;
        this.surface.strokeStyle = `hsla(${30 + (10 - (this.level * 5))},100%,10%,1)`;
        if (this.parent) {
          this.surface.moveTo(this.parent.p0.x, this.parent.p0.y);
          this.surface.quadraticCurveTo(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        }
        this.surface.stroke();
      } else {
        const amt = ~~(Math.random() * 4) + 2;
        this.sproutLeaves(this.p0, this.p1, amt);
      }
    }
    if (this.life === 1 && this.level > 0 && this.level < this.maxLevels) {
      this.branches.push(this.newBranch(this));
      this.branches.push(this.newBranch(this));
      if (Math.random() > 0.85 && this.level < 2) {
        this.branches.push(this.newBranch(this));
        this.branches.push(this.newBranch(this));
      }
    }
    this.life --;
  };

}
