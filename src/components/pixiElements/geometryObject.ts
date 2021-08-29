import { nanoid } from 'nanoid';

export type Position = 'absolute' | 'static';

export interface IGeometryObject {
  id?: number | string;
  position?: Position;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  bottom?: number;
  right?: number;
  padding?: number;
  paddingRight?: number;
  paddingLeft?: number;
  paddingBottom?: number;
  paddingTop?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  bgColor?: number;
  borderRadius?: number;
  parent?: IGeometryObject;
  children?: IGeometryObject[];
}

export class GeometryObject {
  id: string | number;
  position: Position;
  parent?: IGeometryObject;
  children?: IGeometryObject[];
  _x: number;
  _y: number;
  _w: number;
  _h: number;
  bottom: number;
  right: number;
  left: number;
  paddingRight: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingTop: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  bgColor: number;
  borderRadius: number;

  constructor({
    id = null,
    position = 'static',
    x = null,
    y = null,
    w = null,
    h = null,
    bottom = null,
    right = null,
    padding = null,
    paddingRight = null,
    paddingLeft = null,
    paddingBottom = null,
    paddingTop = null,
    marginBottom = 0,
    marginTop = 0,
    marginLeft = 0,
    marginRight = 0,
    bgColor = 0x000,
    borderRadius = 0,
  }: IGeometryObject) {
    this.id = id ?? nanoid();
    this.position = position;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this.paddingLeft = paddingLeft ?? padding ?? 0;
    this.paddingRight = paddingRight ?? padding ?? 0;
    this.paddingBottom = paddingBottom ?? padding ?? 0;
    this.paddingTop = paddingTop ?? padding ?? 0;
    this.marginTop = marginTop;
    this.marginBottom = marginBottom;
    this.marginLeft = marginLeft;
    this.marginRight = marginRight;
    this.bgColor = bgColor;
    this.borderRadius = borderRadius;
    this.bottom = bottom;
    this.right = right;
  }
}
