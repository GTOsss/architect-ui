import { Rect } from '@store/pixi/uiElements/rect';
import * as PIXI from 'pixi.js';
import { Component } from './component';

class Entry extends Rect {
  title: PIXI.Text;
  children: Component[];

  constructor({
    pixi,
    x,
    y,
    w,
    h = 300,
    paddingRight = 10,
    paddingLeft = 10,
    paddingBottom = 10,
    paddingTop = 4,
    title,
    children,
  }) {
    super({ pixi, x, y, w, h, paddingRight, paddingLeft, paddingBottom, paddingTop, bgColor: 0x21262e });
    this.title = new PIXI.Text(title);
    this.title.scale.x = 0.25;
    this.title.scale.y = 0.25;
    this.title.style = { fill: 'white', fontSize: 45, align: 'center' };
    this.title.x = x + w / 2 - this.title.width / 2;
    this.title.y = y + paddingTop;
    this.children = children;

    this.children.forEach((el, i) => {
      el.w = w - (paddingLeft + paddingRight);
      el.x = x + paddingLeft;
      el.y = i === 0 ? y + 20 : (6 + el.h) * i;
    });
  }
}
