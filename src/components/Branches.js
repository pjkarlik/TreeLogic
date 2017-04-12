import Canvas from './Canvas';
import Branch from './Branch';
import Mouse from './Mouse';

export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width || ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    this.height = height || ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.can = new Canvas(this.element);
    this.mouse = new Mouse();
    this.renderCanvas = this.can.createCanvas('canvas');
    this.surface = this.renderCanvas.surface;
    this.canvas = this.renderCanvas.canvas;
    this.maxLevels = 7;
    this.nBranches = 0;
    this.maxBranches = 150;
    this.frame = 0;
    this.root = new Branch(false, this.maxLevels, this.maxLevels, this.width / 2, this.height / 2, this.surface);
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

  renderLoop = () => {
    this.frame++;
    // const mouse = this.mouse.pointer();
    const tempX = 1.359;
    // const tempY = ((this.height / 2) - mouse.y) * 0.002;
    this.surface.drawImage(this.canvas, tempX, tempX,
      this.canvas.width - (tempX * 2), this.canvas.height - (tempX * 2));

    if (this.frame % 5 === 0) {
      this.surface.globalCompositeOperation = 'lighten';
      this.surface.fillStyle = 'rgba(255,255,255,0.05)';
      this.surface.fillRect(0, 0, this.width, this.height);
      this.surface.globalCompositeOperation = 'source-over';
    }

    this.root.grow();

    if (Math.random() > 0.75) {
      const branch = new Branch(this.current, this.current.level, this.maxLevels,
        this.current.p1.x, this.current.p1.y, this.surface);
      this.current.branches.push(branch);

      if (Math.random() > 0.7) {
        this.current.branches.push(this.current.newBranch(this.current));
      }

      this.current = branch;
      this.nBranches++;
    }

    if (this.nBranches > this.maxBranches) {
      this.root = this.root.branches[0];
      this.nBranches--;
    }
    if (this.frame % 10 === 0 ) {
      console.log(this.root);
    }
    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
