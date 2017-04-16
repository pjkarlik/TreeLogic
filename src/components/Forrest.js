import Canvas from './Canvas';
import Branch from './TreeBranch';
import Mouse from './Mouse';
import dat from 'dat-gui';

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
    this.maxLevels = 8;
    this.nBranches = 0;
    this.maxBranches = 200;
    this.frame = 0;
    this.fade = 3;
    this.shaderType = 'difference';
    this.root = new Branch(false, this.maxLevels, this.maxLevels, this.xPosition(), this.height + 20, this.surface);
    this.current = this.root;
    window.addEventListener('resize', this.resetCanvas);
    // run function //
    this.createGUI();
    this.renderLoop();
  }
  setOptions = (options) => {
    this.maxLevels = options.maxLevels || this.maxLevels;
    this.fade = options.fade || this.fade;
    this.shaderType = options.shaderType || this.shaderType;
    this.root = new Branch(false, this.maxLevels, this.maxLevels, this.xPosition(), this.height + 20, this.surface);
    this.current = this.root;
  };
  createGUI = () => {
    this.options = {
      maxLevels: 7,
      fade: 4,
      shaderType: 'screen',
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');

    folderRender.add(this.options, 'maxLevels', 3, 11).step(1)
      .onFinishChange((value) => {
        this.options.maxLevels = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'fade', 1, 20).step(1)
      .onFinishChange((value) => {
        this.options.fade = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'shaderType',
    ['difference', 'lighten', 'exclusion', 'darken', 'xor', 'screen', 'overlay'])
    .onFinishChange((value) => {
      this.options.shaderType = value;
      this.setOptions(this.options);
    });
    folderRender.open();

    this.setOptions(this.options);
  };
  xPosition = () => {
    const floorPos = Math.random() * this.width;
    return floorPos;
  };
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
    const mouse = this.mouse.pointer();
    const tempX = 0.01 + ((this.width / 2) - mouse.x) * 0.002;
    const tempY = (-0.1) + ((this.height / 2) - mouse.y) * 0.002;
    this.surface.drawImage(this.canvas, tempX, tempY);

    if (this.frame % this.fade === 0) {
      this.surface.globalCompositeOperation = this.shaderType;
      this.surface.fillStyle = 'rgba(20,20,180,0.06)';
      this.surface.fillRect(0, 0, this.width, this.height);
      this.surface.globalCompositeOperation = 'source-over';
    }

    this.root.grow();

    if (Math.random() > 0.85) {
      const branch = new Branch(this.current, this.current.level, this.maxLevels,
        this.current.p1.x, this.current.p1.y, this.surface);
      this.current.branches.push(branch);

      if (Math.random() > 0.85) {
        const newPositon = {
          x: this.xPosition(),
          y: this.height,
        };
        const newTrunk = {
          ...this.current,
          p1: { ...newPositon },
          p0: { ...newPositon },
        };
        this.current.branches.push(this.current.newBranch(newTrunk));
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
