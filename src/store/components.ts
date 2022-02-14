import { combine } from './rootDomain';
import { $atomMap, $moduleMap } from './sourceMaps';

export const $components = combine($atomMap, $moduleMap, (atomMap, moduleMap) => {
  const coords: any = {
    atoms: {},
    modules: {},
  };
  if (atomMap && atomMap.map) {
    Object.keys(atomMap.map).forEach((name) => {
      coords.atoms[name] = { x: 300, y: 300, width: 150, height: 150 };
    });
  }
  coords.atoms = {
    ...coords.atoms,
    button: { x: 600, y: 400, width: 150, height: 150 },
  };
  console.log(coords);
  return coords;
});
