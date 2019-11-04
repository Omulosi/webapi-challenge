const express = require('express');
const helmet = require('helmet');
const projectRouter = require('./projects/projectRouter');
const actionRouter = require('./actions/actionRouter');

const server = express();

server.use(helmet());

server.use(express.json());

server.use(logger);

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Project API - Documentation here!</h2>`)
});



function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date();

  console.log(`INFO: (${method} : ${url} : ${timestamp})`);

  next();

}

module.exports = server;
