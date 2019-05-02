const Express = require('express');
const Images = require('../lib/images');
const Path = require('path');

const Router = Express.Router();

Router.get('/:id', async (req, res) => {
  const imageId = req.params.id;
  const image = await Images.getImage(imageId);
  res.sendFile(Path.join(__dirname, '../..', image.path));
});

Router.get('/:id/thumbnail', async (req, res) => {
  const imageId = req.params.id;
  const image = await Images.getImage(imageId);
  res.sendFile(Path.join(__dirname, '../..', image.thumbnail));
});

module.exports = Router;
