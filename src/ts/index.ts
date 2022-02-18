import { Canvas } from 'fabric/fabric-impl';

export type RemoveActivePort = {
  canvasJSON: Canvas;
  sourceMapCanvas: Canvas;
  tab: Tab;
};

export type Tab = 'JSON' | 'source-maps';
