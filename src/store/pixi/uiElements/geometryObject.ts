export interface IGeometryObject {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  bottom?: number;
  paddingRight?: number;
  paddingLeft?: number;
  paddingBottom?: number;
  paddingTop?: number;
  bgColor?: number;
  borderRadius?: number;
}

export class GeometryObject {
  _x: number;
  _y: number;
  _w: number;
  _h: number;
  bottom: number;
  paddingRight: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingTop: number;
  bgColor: number;
  borderRadius: number;

  constructor({
    x = null,
    y = null,
    w = null,
    h = null,
    bottom = null,
    paddingRight = 0,
    paddingLeft = 0,
    paddingBottom = 0,
    paddingTop = 0,
    bgColor = 0x000,
    borderRadius = 0,
  }) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this.paddingLeft = paddingLeft;
    this.paddingRight = paddingRight;
    this.paddingBottom = paddingBottom;
    this.paddingTop = paddingTop;
    this.bgColor = bgColor;
    this.borderRadius = borderRadius;
    this.bottom = bottom;
  }
}
