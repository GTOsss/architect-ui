import * as PIXI from 'pixi.js';
import { nanoid } from 'nanoid';
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

  constructor({ pixi, children = [], id, ...rest }: IRect) {
    super({ ...rest, id: id ?? nanoid() });
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
    if (this._x === null) {
      return this.parent?.x + this.parent?.paddingLeft;
    }

    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    if (this.bottom !== null) {
      return this.parent?.y + this.parent?.h - this.h - this.bottom;
    }

    if (this._y === null) {
      let indexOfCurrentElement = this.parent?.children?.findIndex(({ id }) => this.id === id) || 0;
      indexOfCurrentElement = indexOfCurrentElement === -1 ? 0 : indexOfCurrentElement;
      const beforeElements = this.parent?.children?.slice(0, indexOfCurrentElement) || [];
      const sumOfHeightBeforeElements = beforeElements.reduce((acc, { h }) => acc + h, 0);
      return this.parent?.y + this.parent?.paddingTop + sumOfHeightBeforeElements;
    }

    const parentY = this.parent?.y || 0; // relative
    return parentY + this._y;
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
      return this.children.reduce((acc, el) => acc + el.h + this.paddingTop + this.paddingBottom, 0);
    }

    return this._h + this.paddingTop + this.paddingBottom;
  }

  set h(value) {
    this._h = value;
  }
}
