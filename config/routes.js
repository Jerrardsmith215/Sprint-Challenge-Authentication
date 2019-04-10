const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../database/users-model');
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // create a hashed password to be used in db
  user.password = hash; // set user password to new hash
  if (user.password && user.username) { // check if username and password are passed in
    Users.insert(user) // if so, insert user to db
      .then(newUser => {
        res
          .status(201)
          .json({ message: `User "${newUser.username}" created`})
      }).catch(err =>{
        res.status(500).json(error)
      })
  } else { // if not, give 401
    res.status(400).json({ message: 'Username and Password required! '})
  }
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
