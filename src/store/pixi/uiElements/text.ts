import * as PIXI from 'pixi.js';
import { IGeometryObject, GeometryObject } from '@store/pixi/uiElements/geometryObject';
import { Rect } from '@store/pixi/uiElements/rect';

interface IText extends IGeometryObject {
  text: string;
  align?: 'left' | 'center' | 'right';
  style: Partial<PIXI.TextStyle>;
  pixi?: PIXI.Application;
}

export class Text extends GeometryObject {
  _text: string;
  _style: Partial<PIXI.TextStyle>;
  _pixi: PIXI.Application;
  _align: 'left' | 'center' | 'right';
  pixiText: PIXI.Text;
  parent: Rect;

  constructor({ text, pixi, style, align = 'left', ...rest }: IText) {
    super(rest);
    this._text = text;
    this._style = style;
    this.pixiText = new PIXI.Text(text);
    this._w = PIXI.TextMetrics.measureText(text, new PIXI.TextStyle(style)).width;

    this._pixi = pixi;
    this._align = align;
  }

  render() {
    this.update();
    this.pixi.stage.addChild(this.pixiText);
  }

  update() {
    if (!this.pixiText) return;
    this.pixiText.x = this.x;
    this.pixiText.y = this.y;
    this.pixiText.style = this._style;
    this.pixiText.text = this._text;
  }

  set text(value) {
    this.update();
  }

  get pixi() {
    return this._pixi || this.parent?.pixi;
  }

  get x() {
    const calcMap = {
      left: () => this._x || this.parent?.x + this.parent?.paddingLeft,
      center: () => this.parent?.x + this.parent?.w / 2 - this._w / 2,
      right: () => this._x + this.parent?._w - this._w,
    };

    return calcMap[this.align]();
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    if (this._y === null) {
      return this.parent?.y + this.parent?.paddingTop;
    }

    const parentY = this.parent?.y || 0;
    return parentY + this._y;
  }

  set y(value) {
    this._y = value;
  }

  get align() {
    return this._align;
  }
}
