const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(logger('tiny'));

configureRoutes(server);

module.exports = server;
