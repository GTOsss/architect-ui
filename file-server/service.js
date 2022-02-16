const { parseFiles, getObjectWithPaths } = require('architect-project/src/functions/');
const path = require('path');
const configPath = require('architect-project/src/configPath');
const config = require(configPath.config);

class FileService {
  async getAllAPaths(sourceMap) {
    try {

      const sourceMapByAtoms = { ...sourceMap.map };
      const newSourceMap = { ...sourceMap };

      const { map, aliases = {}, defaultParams: allDefaultParams = {} } = sourceMap;

      const templates = getObjectWithPaths(configPath.templatesPath || '');
      const templateMap = parseFiles(templates);
      Object.entries(sourceMapByAtoms).forEach(([componentName, templates]) => {
        templates.forEach((template, index) => {
          const templateIsString = typeof template === 'string';

          let params = templateIsString ? {} : template[1];
          params = params || {};

          let templateName = templateIsString ? template : template[0];
          templateName = aliases[templateName] || templateName;

          const defaultParams = allDefaultParams[templateName];

          const { rPath } = params;

          if (params.rPath && defaultParams.path) {
            params.rPath = `${defaultParams.path}${params.rPath}`;
          }

          const mergedParams = { ...defaultParams, ...params };
          const currentPath = mergedParams.rPath || mergedParams.path;
          delete mergedParams.path;

          const hasAdditionalParams = Object.keys(mergedParams).length;

          const valueInSourceMap = hasAdditionalParams ? { template: templateName, ...mergedParams } : templateName;

          let componentNameWithParams = componentName;
          if (params.name) {
            componentNameWithParams = params.name;
          }

          const currentTemplate = Object.entries(templateMap).find(([template, templateValue]) => template === templateName)

          const { parsedFiles } = currentTemplate[1];

          const templateParams = { ...valueInSourceMap, name: componentNameWithParams };

          const inputPath = path.resolve(configPath.templatesPath, currentTemplate[0] || '');

          parsedFiles.forEach(async (el) => {
            let filePath = el.file;
            const reGetFileName = new RegExp(`(?<=\\${config.itrFileNameStart})(.+?)(?=\\${config.itrFileNameEnd})`, 'gi');

            const matchedBracketsPath = el.file.match(reGetFileName);

            if (matchedBracketsPath) {
              matchedBracketsPath.forEach((item) => {
                const reComponentName = new RegExp(`\\${config.itrFileNameStart}${item}\\${config.itrFileNameEnd}`, 'gi');

                filePath = filePath.replace(reComponentName, templateParams[item]);
              });
            }
            filePath = filePath.replace(inputPath, '').replace(config.templateExt, '');
            if (typeof sourceMapByAtoms[componentName][index] === 'string') {
              sourceMapByAtoms[componentName][index] = [sourceMapByAtoms[componentName][index], { components: [filePath], configOutput: config.output, defaultPath: defaultParams.path, rPath }]
            } else if (sourceMapByAtoms[componentName][index][1].components) {
              sourceMapByAtoms[componentName][index][1].components.push(filePath);
            } else {
              sourceMapByAtoms[componentName][index][1] = { ...sourceMapByAtoms[componentName][index][1], components: [filePath], configOutput: config.output, defaultPath: defaultParams.path, rPath }
            }
          });
        });
      });
      newSourceMap.map = sourceMapByAtoms
      return newSourceMap;
    } catch(error) {
      console.log('!!!', error);
    }
  }
}

module.exports = new FileService();
