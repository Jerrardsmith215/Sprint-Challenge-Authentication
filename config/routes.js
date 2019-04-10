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
  console.log(user)
  if (user.password && user.username) { // check if username and password are passed in
    Users.add(user) // if so, insert user to db
      .then(newUser => {
        console.log(newUser)
        res
          .status(201)
          .json({ message: `User: ${user.username} created`})
      }).catch(err =>{
        res.status(500).json(err)
      })
  } else { // if not, give 401
    res.status(400).json({ message: 'Username and Password required! '})
  }
}

function login(req, res) {
  let { username, password } = req.headers;
  Users.findByUsername(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else res.status(401).json({ message: 'Invalid credentials...' });
    })
    .catch(err => {
      res.status(500).json(err);
    })
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
