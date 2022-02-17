const Router = require('express').Router;
const prettier = require('prettier');
const FileService = require('./service');
const fs = require('fs');

const router = new Router();

router.get('/source-map/module', (req, res) => {
  try {
    const appRoot = process.cwd();
    const modulePath = `${appRoot}/architect/source_map/source-map-module`;
    const file = require(modulePath);
    res.send(file);
  } catch (error) {
    res.sendStatus(500).send(error);
  }
});

router.get('/source-map/atom', async (req, res) => {
  try {
    const appRoot = process.cwd();
    const atomPath = `${appRoot}/architect/source_map/source-map-atom.js`;
    const file = require(atomPath);
    const withPaths = await FileService.getAllAPaths(JSON.parse(JSON.stringify(file)));
    res.send(withPaths);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
});

router.get('/config', (req, res) => {
  try {
    const appRoot = process.cwd();
    const configPath = `${appRoot}/architect/config`;
    const file = require(configPath);
    res.send(file);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
});

router.get('/path', (req, res) => {
  try {
    const projectPath = process.cwd();
    res.send(projectPath);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
})

router.post('/atom', (req, res) => {
  try {
    const projectPath = process.cwd();
    fs.writeFileSync(`${projectPath}/architect/source_map/source-map-atom.js`, req.body.data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/module', (req, res) => {
  try {
    const projectPath = process.cwd();
    const newFile = prettier.format(req.body.data, {
      semi: true,
      trailingComma: 'all',
      singleQuote: true,
      printWidth: 120,
      tabWidth: 2,
      arrowParens: 'always',
      parser: 'babel',
      endOfLine: 'lf',
    });
    fs.writeFileSync(`${projectPath}/architect/source_map/source-map-module.js`, newFile);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/canvas', (req, res) => {
  try {
    const projectPath = process.cwd();
    fs.writeFileSync(`${projectPath}/architect/canvas/canvas.json`, JSON.stringify(req.body.data))
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error)
  };
});

router.get('/canvas', (req, res) => {
  try {
    const projectPath = process.cwd();
    const canvas = fs.readFileSync(`${projectPath}/architect/canvas/canvas.json`);
    res.status(200).send(JSON.stringify(JSON.parse(canvas)));
  } catch (error) {
    res.status(500).send(error)};
})

module.exports = router;
