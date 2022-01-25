// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

const toCamelCase = (str) => {
  return _.upperFirst(_.camelCase(str));
};

const toKebabCase = (str) => {
  return _.kebabCase(str);
};

const toLowerCamelCase = (str) => {
  return _.lowerFirst(_.camelCase(str));
};

module.exports = {
  toCamelCase,
  toKebabCase,
  toLowerCamelCase,
  toLowerFirst: _.lowerFirst,
  getIn: _.get,
};
