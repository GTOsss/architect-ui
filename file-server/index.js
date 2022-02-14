const express = require('express');
const cors = require('cors');
const router = require('./router');

const PORT = 9999;

const app = express();
app.use(express.json({ limit: '2MB' }));
app.use(cors());

app.use('/', router);

const start = () => {
  app.listen(PORT, () => console.log(`Server started at the port ${PORT}`));
};

start();

module.exports = start;
