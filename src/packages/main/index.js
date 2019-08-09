import {isMobile} from '../../utils/tools';

const events = {
  down: isMobile ? 'touchstart' : 'mousedown',
  move: isMobile ? 'touchmove' : 'mousemove',
  up: isMobile ? 'touchend' : 'mouseup',
};

const getPoint = e => {
  return e.touches ? e.touches[0] : e;
};

const getOffset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
	x: rect.left,
	y: rect.top
  };
};

const getPosition = (offset, point, dpr) => {
  const {x, y} = offset;
  return {
	x: (point.clientX - x) * dpr,
	y: (point.clientY - y) * dpr,
  };
};

export default class Writer {
  $options = {
	width: 500,
	height: 300,
	lineWidth: 10,
	color: '#4598f0',
	background: '#fff',
	el: document.body,
	devicePixelRatio: window.devicePixelRatio
  };

  pointList = [];
  lines = [];

  constructor(opt = {}) {
	this.$options = {...this.$options, ...opt};
	this.create();
	this.mount();
	this.listen();
  }

  create() {
	const cvs = this.$canvas = document.createElement('canvas');
	this.ctx = this.$canvas.getContext('2d');
	const {devicePixelRatio, width, height} = this.$options;
	cvs.width = width * devicePixelRatio;
	cvs.height = height * devicePixelRatio;
	cvs.style.width = width + 'px';
	cvs.style.height = height + 'px';
  }

  mount() {
	this.$options.el.appendChild(this.$canvas);
  }

  listen() {
	this.$canvas.addEventListener(events.down, this.down);
	this.$canvas.addEventListener(events.move, this.move);
	this.$canvas.addEventListener(events.up, this.up);
  }

  getPoint = e => {
	return getPosition(this.offset, getPoint(e), this.$options.devicePixelRatio);
  };

  down = e => {
	this.pointstart = true;
	this.offset = getOffset(this.$canvas);
	const point = this.getPoint(e);
	this.pointList = [point];
	this.lines.push({
	  line: this.pointList,
	  options: {...this.$options}
	});
  };
  move = e => {
	if (!this.pointstart) return;
	e.preventDefault();
	const point = this.getPoint(e);
	this.pointList.push(point);
	this.draw();
  };
  up = e => {
	if (!this.pointstart) return;
	this.pointstart = false;
	this.pointList = [];
	this.draw();
  };

  draw() {
	const ctx = this.ctx;
	ctx.save();
	ctx.fillStyle = this.$options.background;
	ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
	ctx.restore();
	ctx.lineCap = 'round';
	ctx.lineJoin = "round";
	this.lines.forEach(points => {
	  const {line, options} = points;
	  if (!line.length) return;
	  ctx.save();
	  ctx.lineWidth = options.lineWidth * this.$options.devicePixelRatio;
	  ctx.strokeStyle = options.color;
	  ctx.beginPath();
	  ctx.moveTo(line[0].x, line[0].y);
	  line.forEach(point => {
		ctx.lineTo(point.x, point.y);
	  });
	  ctx.stroke();
	  ctx.restore();
	});
  }

  output = (type = 'image/png', quality = 1) => {
	return this.$canvas.toDataURL(type, quality);
  };

  download = (name = Date.now() + '.png') => {
	const link = document.createElement('a');
	link.href = this.output();
	link.download = name;
	link.click();
  };

  clear = () => {
	this.lines = [];
	this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  };
}
