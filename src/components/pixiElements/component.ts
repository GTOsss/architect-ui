import { Rect } from '@components/pixiElements/rect';
import * as PIXI from 'pixi.js';

export class Component extends Rect {
  textNameLabel: PIXI.Text;
  textName: PIXI.Text;
  textTemplateLabel: PIXI.Text;
  textTemplate: PIXI.Text;
  textFiles: PIXI.Text[];
  textLabelPath: PIXI.Text;
  textDefaultPath: PIXI.Text;
  textRelativePath: PIXI.Text;
  textOpenFolder: PIXI.Text;
  bodyRectangle: PIXI.Graphics;

  constructor({ pixi, x, y, w, h = 64, paddingRight = 2, paddingLeft = 2, paddingBottom = 2, paddingTop = 2, name }) {
    super({ pixi, x, y, w, h, paddingRight, paddingLeft, paddingBottom, paddingTop, bgColor: 0x8b9aae });

    this.bodyRectangle = new PIXI.Graphics();
    this.bodyRectangle.beginFill(0x76808e);
    this.bodyRectangle.drawRect(0, 0, w, 40);
    this.bodyRectangle.x = x;
    this.bodyRectangle.y = y + 20;

    this.textNameLabel = new PIXI.Text('name');
    this.textNameLabel.scale.x = 0.25;
    this.textNameLabel.scale.y = 0.25;
    this.textNameLabel.x = x + paddingLeft;
    this.textNameLabel.y = y + paddingTop;
    this.textNameLabel.style = { fill: 'black', fontSize: 26 };

    this.textName = new PIXI.Text(name);
    this.textName.scale.x = 0.25;
    this.textName.scale.y = 0.25;
    this.textName.x = x + paddingLeft;
    this.textName.y = x + paddingTop;
  }
}
