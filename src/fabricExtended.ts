import { fabric } from 'fabric';

const fabricExtended = {
  ...fabric,
  LineArrow: fabric.util.createClass(fabric.Line, {
    type: 'lineArrow',

    initialize(element, options = {}) {
      this.callSuper('initialize', element, options);
    },

    toObject() {
      return fabric.util.object.extend(this.callSuper('toObject'), null);
    },

    _render(ctx) {
      this.callSuper('_render', ctx);

      // do not render if width/height are zeros or object is not visible
      if (this.width === 0 || this.height === 0 || !this.visible) return;

      ctx.save();

      const xDiff = this.x2 - this.x1;
      const yDiff = this.y2 - this.y1;
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      // move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
      ctx.moveTo(-5, 0);
      ctx.lineTo(-20, 7.5);
      ctx.lineTo(-20, -7.5);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();

      ctx.restore();
    },
  }),
};

export default fabricExtended;
