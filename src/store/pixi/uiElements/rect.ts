import * as PIXI from 'pixi.js';
import { yGetter } from '@store/pixi/uiElements/commonMethods';
import { Text } from './text';
import { GeometryObject, IGeometryObject } from './geometryObject';

export interface IRect extends IGeometryObject {
  pixi?: PIXI.Application;
  children?: (Rect | Text)[];
}

export class Rect extends GeometryObject {
  pixiGraphic: PIXI.Graphics;
  _pixi: PIXI.Application;
  parent: null | Rect;
  children: (Rect | Text)[];

  constructor({ pixi, children = [], ...rest }: IRect) {
    super({ ...rest });
    this._pixi = pixi;

    this.pixiGraphic = new PIXI.Graphics();

    this.children = children;
    this.children.forEach((el) => {
      el.parent = this;
    });
  }

  render() {
    this.update();
    this.pixiGraphic.lineStyle(0, 0x333333);
    this.pixiGraphic.beginFill(this.bgColor);
    this.pixiGraphic.x = this.x;
    this.pixiGraphic.y = this.y;
    this.pixiGraphic.drawRoundedRect(0, 0, this.w, this.h, this.borderRadius);
    this.pixi.stage.addChild(this.pixiGraphic);
    this.children.forEach((el) => el.render());
  }

  update() {
    this.children.forEach((child) => child.update());

    if (!this.pixiGraphic) return;

    this.pixiGraphic.x = this.x;
    this.pixiGraphic.y = this.y;
    this.pixiGraphic.width = this.w;
    this.pixiGraphic.height = this.h;
  }

  get pixi() {
    return this._pixi || this.parent?.pixi;
  }

  get x() {
    if (this.right) {
      return this.parent?.x + this.parent?.w - this.right - this.w;
    }

    if (this._x === null) {
      return this.parent?.x + this.parent?.paddingLeft;
    }

    return this._x;
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

  get w() {
    if (this._w === null) {
      return this.parent?.w - this.parent?.paddingLeft - this.parent?.paddingRight;
    }

    return this._w;
  }

  set w(value) {
    this._w = value + this.paddingLeft + this.paddingRight;
  }

  get h() {
    if (this._h === null) {
      return (
        this.children
          .filter(({ position }) => position === 'static')
          .reduce((acc, el) => acc + el.h + el.marginBottom + el.marginTop, 0) +
        this.paddingTop +
        this.paddingBottom
      );
    }

    return this._h + this.paddingTop + this.paddingBottom;
  }

  set h(value) {
    this._h = value;
  }
}
