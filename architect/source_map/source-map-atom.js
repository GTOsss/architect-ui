const aliases = { rc: 'component' };

const extensions = { component: 'tsx' };

const defaultParams = { component: { path: 'page' } };

const map = {
  stadiums: [['component', { rPath: '/test' }]],
  button: ['rc'],
  invertor: [['rc', { path: 'components/invertor' }]],
  'My first test': ['component'],
  'Apelsin2-0': [['component', { rPath: '/RPathForApelSin2-0' }]],
  coooooo: ['component'],
  stadium: [
    'page',
    ['component', { rPath: '/pages' }],
    ['component', { rPath: '/pages/stadiums', name: 'stadiumItem' }],
    'store',
  ],
};

module.exports = { map, defaultParams, aliases, extensions };
