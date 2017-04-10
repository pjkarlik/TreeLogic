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
    this.mult = 7;
  }

  grow = () => {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].grow();
    }

    if (this.life > 1) {
      this.p1.x += this.vx;
      this.p1.y += this.vy;
      this.surface.beginPath();
      this.surface.lineCap = 'round';
      const lineWidth = this.level * 3 - 2;
      if (this.level) {
        this.surface.lineWidth = lineWidth;
        this.surface.strokeStyle = 'rgba(40,25,0,0.5)';
        if (this.parent) {
          this.surface.moveTo(this.parent.p0.x, this.parent.p0.y);
          this.surface.quadraticCurveTo(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        }
        this.surface.stroke();
      } else {
        this.surface.lineWidth = 7;
        this.surface.strokeStyle = `hsla(${this.hue},100%,50%,0.75)`;
        this.surface.moveTo(this.p0.x, this.p0.y);
        this.surface.lineTo(this.p1.x, this.p1.y);
        this.surface.stroke();
      }
    }
    if (this.life === 1 && this.level > 0 && this.level < this.maxLevels) {
      this.branches.push(this.newBranch(this));
      this.branches.push(this.newBranch(this));
    }
    this.life --;
  };

  newBranch = (parent) => {
    const branch = new Branch(parent, parent.level - 1, this.maxLevels, parent.p1.x, parent.p1.y, this.surface);
    branch.angle = (parent.level === this.maxLevels) ? Math.random() * 2 * Math.PI : Math.atan2(
      parent.p1.y - parent.p0.y,
      parent.p1.x - parent.p0.x
    ) + (Math.random() * 1.4 - 0.7);

    branch.vx = Math.cos(branch.angle) * this.mult;
    branch.vy = Math.sin(branch.angle) * this.mult;
    branch.life = branch.level === 1 ? this.mult : Math.round(Math.random() * (branch.level * 2)) + 3;
    return branch;
  };
}
