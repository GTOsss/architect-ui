import { Rect, Text } from '@store/../components/pixiElements';
import { tick } from '@store/pixi/pixi';

const getComponentName = (component, name: string): string => {
  if (typeof component === 'string') {
    return name;
  }

  if (component[1]) {
    return component[1].name || name;
  }

  return name;
};

const getTemplateName = (component): string => {
  if (Array.isArray(component)) {
    return component[0];
  }

  return component;
};

/// tests

// const defaultParams = {
//   component: { path: 'src/components' },
//   page: { path: 'src/pages' },
//   store: { path: 'src/store' },
// };

const sourceMap = {
  stadiums: [
    'page',
    ['component', { rPath: '/pages' }],
    ['component', { rPath: '/pages/stadiums', name: 'stadiumItem' }],
    'store',
  ],
  stadium: [
    //
    ['page', { rPath: '/stadiums', name: '[code]' }],
    ['component', { rPath: '/pages' }],
    'store',
  ],
  user: [
    //
    ['page', { rPath: '/users', name: 'user' }],
    ['component', { rPath: '/user' }],
    ['component', { rPath: '/userAddition' }],
    'store',
  ],
};

export const pixiScene = ({ pixi }) => {
  if (!pixi) return;

  pixi.stage.x = -0;

  pixi.ticker.add(tick);

  Object.entries(sourceMap).forEach(([name, components], i) => {
    const rectComponents = components.map((component, j) => {
      return new Rect({
        bgColor: 0x76808e,
        marginBottom: 10,
        children: [
          new Rect({
            bgColor: 0x8b9aae,
            padding: 4,
            paddingBottom: 10,
            marginBottom: 2,
            children: [
              new Text({ text: 'name', style: { fill: 'black', fontSize: 11, fontWeight: '600' } }),
              new Text({
                y: 4,
                text: 'template',
                style: { fill: 'black', fontSize: 11, fontWeight: '600' },
                right: 20,
                align: 'right',
                position: 'absolute',
              }),
              new Text({
                text: getComponentName(component, name),
                marginTop: 0,
                style: { fill: 'black', fontSize: 16 },
              }),
              new Text({
                text: getTemplateName(component),
                style: { fill: 'black', fontSize: 16 },
                y: 16,
                align: 'right',
                position: 'absolute',
              }),
            ],
          }),
          new Text({
            text: `test ${j}`,
            style: { fill: '#0047B1', fontSize: 16 },
            bgColor: 0x0047b1,
            textDecoration: 'underline',
            marginLeft: 5,
            marginBottom: 3,
            cursor: 'pointer',
            onClick: (e) => {
              console.log('onClick', e);
            },
          }),
          new Text({
            text: `test ${j}`,
            style: { fill: '#0047B1', fontSize: 16 },
            bgColor: 0x0047b1,
            textDecoration: 'underline',
            marginLeft: 5,
            marginBottom: 3,
            cursor: 'pointer',
          }),
          new Text({
            text: `test ${j}`,
            bgColor: 0x0047b1,
            style: { fill: '#0047B1', fontSize: 16 },
            textDecoration: 'underline',
            marginLeft: 5,
            marginBottom: 3,
            cursor: 'pointer',
          }),
          new Rect({
            padding: 5,
            bgColor: 0x8b9aae,
            children: [
              new Text({ text: 'path', style: { fill: 'black', fontSize: 11, fontWeight: '600' } }),
              new Rect({
                display: 'flex',
                bgColor: 0x8b9aae,
                marginTop: 4,
                children: [
                  new Text({
                    text: '/test1',
                    marginRight: 2,
                    style: { fill: '#D6D6D6', fontWeight: '700', fontSize: 16 },
                    bgColor: 0xd6d6d6,
                  }),
                  new Text({ text: '/test2', marginRight: 2, style: { fill: 'black', fontSize: 16 } }),
                  new Text({ text: '/test3', marginRight: 2, style: { fill: 'black', fontSize: 16 } }),
                ],
              }),
              new Text({
                text: 'open folder',
                textDecoration: 'underline',
                style: { fill: '#0047B1', fontSize: 12 },
                bgColor: 0x0047b1,
                position: 'absolute',
                paddingBottom: 8,
                bottom: -2,
                align: 'right',
                cursor: 'pointer',
              }),
            ],
          }),
        ],
      });
    });

    const rect = new Rect({
      pixi,
      x: i * 300 + i * 20 + 10,
      y: 10,
      w: 300,
      paddingTop: 12,
      paddingLeft: 10,
      paddingRight: 10,
      bgColor: 0x21262e,
      borderRadius: 10,
      children: [
        new Text({ text: name, style: { fill: 'white', fontSize: 18 }, y: 6, align: 'center' }),
        ...rectComponents,
        new Rect({
          bgColor: 0xa7b7cd,
          marginBottom: 10,
          marginTop: 10,
          w: 100,
          h: 26,
          borderRadius: 5,
          children: [new Text({ text: 'add item', style: { fill: 'black', fontSize: 16 }, y: 4, align: 'center' })],
        }),
      ],
    });

    rect.render();
  });
};
