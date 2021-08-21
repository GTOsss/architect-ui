import * as PIXI from 'pixi.js';
import { IGeometryObject, GeometryObject } from '@store/pixi/uiElements/geometryObject';
import { Rect } from '@store/pixi/uiElements/rect';
import { xGetterForFlex, yGetter } from '@store/pixi/uiElements/commonMethods';

type TextDecoration = 'underline' | 'none';

interface IText extends IGeometryObject {
  text: string;
  align?: 'left' | 'center' | 'right';
  style: Partial<PIXI.TextStyle>;
  pixi?: PIXI.Application;
  textDecoration?: TextDecoration;
}

export class Text extends GeometryObject {
  _text: string;
  _style: Partial<PIXI.TextStyle>;
  _pixi: PIXI.Application;
  _align: 'left' | 'center' | 'right';
  pixiText: PIXI.Text;
  parent: Rect;
  textDecoration: TextDecoration;
  pixiGraphicUnderline: PIXI.Graphics;

  constructor({ text, pixi, style, align = 'left', textDecoration = 'none', ...rest }: IText) {
    super(rest);
    this._text = text;
    this._style = style;
    this.pixiText = new PIXI.Text(text);
    this.pixiGraphicUnderline = new PIXI.Graphics();

    this.textDecoration = textDecoration;
    // this._w = PIXI.TextMetrics.measureText(text, new PIXI.TextStyle(style)).width;

    this._pixi = pixi;
    this._align = align;
  }

  render() {
    this.update();
    this.pixi.stage.addChild(this.pixiText);
    if (this.textDecoration === 'underline') {
      this.pixi.stage.addChild(this.pixiGraphicUnderline);
    }

    // this.pixi.stage.beginPath();
    // this.pixi.stage.strokeStyle = this._style.fill;
    // this.pixi.stage.lineWidth = 2;
    // this.pixi.stage.moveTo(this.x, this.y);
    // this.pixi.stage.lineTo(this.x + this.w, this.y + this.h);
    // this.pixi.stage.strokeStyle = this._style.fill;
    // this.pixi.stage.stroke();
  }

  update() {
    if (!this.pixiText) return;
    this.pixiText.x = this.x;
    // console.log('y for tex ', `${this._text}`, this.y);
    this.pixiText.y = this.y;
    this.pixiText.style = this._style;
    this.pixiText.text = this._text;

    this.pixiGraphicUnderline.lineStyle(0, 0x333333);
    this.pixiGraphicUnderline.beginFill(this.bgColor);
    this.pixiGraphicUnderline.x = this.x;
    this.pixiGraphicUnderline.y = this.y + this._style.fontSize + 2;
    this.pixiGraphicUnderline.drawRect(0, 0, this.w, 1);
  }

  set text(value) {
    this.update();
  }

  get pixi() {
    return this._pixi || this.parent?.pixi;
  }

  get x() {
    if (this._x === null && this.parent?.display === 'flex') {
      return xGetterForFlex(this);
    }

    const calcMap = {
      left: () => this._x || this.parent?.x + this.parent?.paddingLeft + this.marginLeft,
      center: () => this.parent?.x + this.parent?.w / 2 - this.w / 2,
      right: () => (this._x || this.parent?.x) + this.parent.w - this.parent.paddingRight - this.w,
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

  get w() {
    return (
      PIXI.TextMetrics.measureText(this._text, new PIXI.TextStyle(this._style)).width +
      this.paddingLeft +
      this.paddingRight
    );
  }
}
