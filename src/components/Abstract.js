import Canvas from './Canvas';
import Branch from './AltBranch';
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
    this.click = false;
    window.addEventListener('resize', this.resetCanvas);
    window.addEventListener('click', this.onClick);
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

  onClick = (e) => {
    e.preventDefault();
    this.click = true;
  }

  renderLoop = () => {
    this.frame++;
    // const mouse = this.mouse.pointer();
    const tempX = 0.359;
    this.surface.drawImage(this.canvas, tempX, tempX,
      this.canvas.width - (tempX * 2), this.canvas.height - (tempX * 2));

    if (this.frame % 2 === 0) {
      this.surface.globalCompositeOperation = 'multiply';
      this.surface.fillStyle = 'rgba(0,0,0,0.02)';
      this.surface.fillRect(0, 0, this.width, this.height);
      this.surface.globalCompositeOperation = 'source-over';
    }

    this.root.grow();

    if (this.click) {
      this.click = false;
      const branch = new Branch(this.current, this.current.level, this.maxLevels,
        this.current.p1.x, this.current.p1.y, this.surface);
      this.current.branches.push(branch);

      this.current.branches.push(this.current.newBranch(this.current));

      this.current = branch;
      this.nBranches++;
    }

    if (this.nBranches > this.maxBranches) {
      this.root = this.root.branches[0];
      this.nBranches--;
    }
    if (this.root.branches.length < 2 && this.root.life < 1) {
      this.pause = false;
    }
    if (this.frame % 20 === 0 & this.frame < 40) {
      console.log(this.root);
    }

    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
