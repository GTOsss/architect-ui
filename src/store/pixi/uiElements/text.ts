import * as PIXI from 'pixi.js';
import { IGeometryObject, GeometryObject } from '@store/pixi/uiElements/geometryObject';
import { Rect } from '@store/pixi/uiElements/rect';

interface IText extends IGeometryObject {
  text: string;
  style: Partial<PIXI.TextStyle>;
  pixi?: PIXI.Application;
}

export class Text extends GeometryObject {
  _text: string;
  _style: Partial<PIXI.TextStyle>;
  _pixi: PIXI.Application;
  pixiText: PIXI.Text;
  parent: Rect;

  constructor({ text, pixi, style, ...rest }: IText) {
    super(rest);
    this._text = text;
    this._style = style;
    this.pixiText = new PIXI.Text(text);
    this._pixi = pixi;
  }

  render() {
    this.update();
    this.pixi.stage.addChild(this.pixiText);
  }

  update() {
    if (!this.pixiText) return;
    console.log(this.x, this.y);
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
    if (this._x === null) {
      return this.parent?.x + this.parent?.paddingLeft;
    }

    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    if (this._y === null) {
      return this.parent?.y + this.parent?.paddingTop;
    }

    return this._y;
  }

  set y(value) {
    this._y = value;
  }
}
