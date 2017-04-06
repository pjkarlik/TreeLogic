import Point from './Point';

export default class Branch {
  constructor(parent, level, x, y, canvas) {
    this.parent = parent;
    this.branches = [];
    this.canvas = canvas;
    this.p0 = parent ? parent.p1 : new Point(x, y);
    this.p1 = new Point(x, y);
    this.level = level;
    this.maxLevels = level;
    this.life = 20;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
  }

  grow = () => {
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      if (branch.life < 0 && branch.length > 1) {
        this.branches[i].splice(i, 1);
      } else {
        branch.grow();
      }
    }

    if (this.life > 1) {
      this.p1.x += this.vx;
      this.p1.y += this.vy;
      this.canvas.beginPath();
      this.canvas.lineCap = 'round';

      if (this.level) {
        this.canvas.lineWidth = this.level * 6 - 5;
        this.canvas.strokeStyle = '#000';
        if (this.parent) {
          this.canvas.moveTo(this.parent.p0.x, this.parent.p0.y);
          this.canvas.quadraticCurveTo(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        }
        this.canvas.stroke();
      } else {
        this.canvas.lineWidth = 10;
        this.canvas.strokeStyle = '#f40';
        this.canvas.moveTo(this.p0.x, this.p0.y);
        this.canvas.lineTo(this.p1.x, this.p1.y);
        this.canvas.stroke();
      }
    }
    // console.log(this.life);
    // console.log(this.life, this.level);
    if (this.life === 1 && this.level > 0 && this.level < this.maxLevels) {
      this.branches.push(this.newBranch(this));
      this.branches.push(this.newBranch(this));
    }
    this.life--;
  };

  newBranch = (parent) => {
    const branch = new Branch(parent, parent.level - 1, parent.p1.x, parent.p1.y, this.canvas, this.newBranch);
    branch.angle = (parent.level === this.maxLevels) ? Math.random() * 2 * Math.PI : Math.atan2(
      parent.p1.y - parent.p0.y,
      parent.p1.x - parent.p0.x
    ) + (Math.random() * 1.4 - 0.7);

    branch.vx = Math.cos(branch.angle) * 12;
    branch.vy = Math.sin(branch.angle) * 12;
    branch.life = branch.level === 1 ? 8 : Math.round(Math.random() * (branch.level * 2)) + 2;
    return branch;
  };
}
