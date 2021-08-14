import * as PIXI from 'pixi.js';
import { IGeometryObject, GeometryObject } from '@store/pixi/uiElements/geometryObject';
import { Rect } from '@store/pixi/uiElements/rect';
import { yGetter } from '@store/pixi/uiElements/commonMethods';

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
    // console.log('y for tex ', `${this._text}`, this.y);
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
      right: () => (this._x || this.parent?.x) + this.parent.w - this.parent.paddingRight - this._w,
    };

    return calcMap[this.align]();
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return yGetter(this);
  }

  set y(value) {
    this._y = value;
  }

  get align() {
    return this._align;
  }

  get h() {
    const textHeight = typeof this._style.fontSize === 'number' ? this._style.fontSize : 0;
    return textHeight + this.paddingBottom + this.paddingTop + this.marginTop + this.marginBottom;
  }
}
