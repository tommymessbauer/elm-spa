require('dotenv').config({
  path: process.env.DOTENV
});

const assert = require('assert');

assert.ok(process.env.PUBLIC_PATH, `ERROR: CLI arguments: PUBLIC_PATH is required`);

const main = require('./main.js');
const express = require('express');
const server = express();
const path = require('path');
const fs = require('fs');
const INDEX_HTML = fs.readFileSync(path.join('./dist', 'index.html'), 'utf-8');

const publicPath = process.env.PUBLIC_PATH;

main(publicPath, server);

server.use(`${publicPath}/static`, express.static('./dist/static'));

server.get(`${publicPath}/*`, (req, res, next) => {
  res.set('content-type', 'text/html');
  res.send(INDEX_HTML);
  res.end();
});

server.use(function(err, req, res, next) {
  const status_code = isNaN(err.status_code) ? 500 : Number(err.status_code);
  res.status(status_code).send(err.message);
});

server.listen(process.env.PORT);
console.log(`App server is now running at http://localhost:${process.env.PORT}.`);
