import Branch from './Branch';
import Canvas from './Canvas';

export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width || ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    this.height = height || ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.can = new Canvas(this.element);
    this.renderCanvas = this.can.createCanvas('canvas');
    this.surface = this.renderCanvas.surface;
    this.canvas = this.renderCanvas.canvas;
    this.maxLevels = 8;
    this.nBranches = 0;
    this.maxBranches = 200;
    this.frame = 0;
    this.root = new Branch(false, this.maxLevels, this.width / 2, this.height / 2, this.surface);
    this.current = this.root;
    window.addEventListener('resize', this.resetCanvas);
    // run function //
    this.renderLoop();
  }

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    this.renderCanvas = this.can.setViewport(this.canvas);
    this.surface = this.renderCanvas.surface;
    this.canvas = this.renderCanvas.canvas;
    this.width = this.renderCanvas.width;
    this.height = this.renderCanvas.height;
    this.root = this.root.branches[0];
    this.nBranches--;
    this.renderLoop();
  };

  newBranch = (parent) => {
    const branch = new Branch(parent, parent.level - 1, parent.p1.x, parent.p1.y, this.surface);
    branch.angle = (parent.level === this.maxLevels) ? Math.random() * 2 * Math.PI : Math.atan2(
      parent.p1.y - parent.p0.y,
      parent.p1.x - parent.p0.x
    ) + (Math.random() * 1.4 - 0.7);

    branch.vx = Math.cos(branch.angle) * 12;
    branch.vy = Math.sin(branch.angle) * 12;
    branch.life = branch.level === 1 ? 8 : Math.round(Math.random() * (branch.level * 2)) + 2;
    return branch;
  };

  renderLoop = () => {
    if (++this.frame % 2) {
      this.surface.globalCompositeOperation = 'lighter';
      this.surface.fillStyle = 'rgba(255,255,255,0.01)';
      this.surface.fillRect(0, 0, this.width, this.height);
      this.surface.globalCompositeOperation = 'source-over';
    }

    this.root.grow();

    if (Math.random() > 0.8) {
      const branch = new Branch(this.current, this.current.level, this.current.p1.x, this.current.p1.y, this.surface);
      this.current.branches.push(branch);

      if (Math.random() > 0.8) {
        this.current.branches.push(this.current.newBranch(this.current));
      }

      this.current = branch;
      this.nBranches++;
    }

    if (this.nBranches > this.maxBranches) {
      this.root = this.root.branches[0];
      this.nBranches--;
    }
    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
