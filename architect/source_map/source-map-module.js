const aliases = {
  c: 'component',
  s: 'store',
  i: 'index',
  f: 'file',
};

const map = {
  // 'arcGenerated/endpoints': {
  //   endpoints: 'endpoints',
  // },
  'components/layouts': {
    main: {
      template: 'component',
      param: '13'
    },
  },
  // 'components/inputs': {
  //   index: 'index',
  //   inputSelect: 'component',
  // },
  // 'components/common/teams': {
  //   birthdays: 'component',
  //   teamsMainFilters: 'component',
  //   newsItem: 'component',
  // },
  // 'components/common': {
  //   newsItem: 'component',
  //   match: 'component',
  // },
  // 'components/common/table': {
  //   index: 'index',
  //   tableContainer: 'component',
  //   table: 'component',
  //   tableRow: 'component',
  //   tableHead: 'component',
  //   tableBody: 'component',
  //   tableCell: 'component',
  // },
  // 'components/common/table/context': {
  //   context: 'file',
  // },
  // 'components/new-test': {
  //   test: 'component',
  // },
};

module.exports = {
  aliases,
  map,
};
