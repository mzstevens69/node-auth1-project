const express = require('express');
const helmet = require('helmet')
const cors = require('cors')

const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)
const dbConnect = require('../data/dbConfig')
// routers
const authRouter = require('../auth/auth-router')
const usersRouter = require('../users/users-router')


const server = express();

const sessionConfig = {
  name: "nom-nom-nom", //sid
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 minutes in ms
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore ({
    knex: dbConnect,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60000,
  })
}

server.use(helmet());
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);


server.get('/', (req, res) => {
    res.json({ api: "Rocking on One" });
  });

module.exports = server;