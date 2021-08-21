import * as PIXI from 'pixi.js';

export interface ICursor {
  pixi: PIXI.Application;
  iconDefault: string;
  iconPointer: string;
}

export class Cursor {
  _x: number;
  _y: number;
  iconDefault: string;
  iconPointer: string;
  _pixi: PIXI.Application;
  iconCursorSprite: PIXI.Sprite;

  constructor({ pixi, iconDefault, iconPointer }: ICursor) {
    this._x = 0;
    this._y = 0;
    this._pixi = pixi;
    this.iconDefault = iconDefault;
    this.iconPointer = iconPointer;
    const textureIconCursor = PIXI.Texture.from(iconDefault);
    this.iconCursorSprite = new PIXI.Sprite(textureIconCursor);
  }

  render() {
    this.update();
    this._pixi.stage.addChild(this.iconCursorSprite);
  }

  update() {
    this.iconCursorSprite.x = this._x;
    this.iconCursorSprite.y = this._y;
  }

  set x(v) {
    this._x = v;
    this.update();
  }

  set y(v) {
    this._y = v;
    this.update();
  }
}
