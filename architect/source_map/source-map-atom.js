const aliases = {};

const defaultParams = {
  page: { path: 'pages' },
  component: { path: 'components' },
  store: { path: 'store/data' },
  type: { path: 'ts' },
};

const map = {
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
  otherStadiums: [
    //
    'store',
    ['component', { rPath: '/common/stadiums' }],
  ],
  accessibility: [
    ['page', { rPath: '/stadiums/[code]' }],
    ['component', { rPath: '/pages', name: 'stadiumAccessibility' }],
  ],
  innerMenu: [
    ['component', { rPath: '/common' }],
    ['type', { rPath: '/ui' }],
  ],
  teams: [
    'page',
    ['component', { rPath: '/pages' }],
    ['component', { rPath: '/pages/teams', name: 'teamLink' }],
    'store',
  ],
  teamsOverview: [
    //
    ['page', { rPath: '/teams', name: '[teamId]' }],
    ['component', { rPath: '/pages' }],
    'store',
  ],
  tournamentTable: [
    ['component', { rPath: '/tables/tournamentTable', name: 'tournamentTableFull' }],
    ['component', { rPath: '/tables/tournamentTable', name: 'tournamentTableCompact' }],
    'store',
    ['type', { rPath: '/store/data' }],
  ],
  teamRatingFIFA: [
    ['component', { rPath: '/common/teamRating', name: 'teamRatingFifaFull' }],
    ['component', { rPath: '/common/teamRating', name: 'teamRatingFifaCompact' }],
    'store',
  ],
  gallery: [
    //
    ['component', { rPath: '/common' }],
    'store',
  ],
};

module.exports = {
  aliases,
  defaultParams,
  map,
};
