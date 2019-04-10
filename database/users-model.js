const db = require('./dbConfig');

module.exports = {
    add,
    findByUsername,
    findById
};

function add (user) {
    return db('users').insert(user);
}

function findByUsername (username) {
    return db('users')
        .where('username', username)
        .first();
}

function findById (id) {
    return db('useres')
        .where('id', id)
        .first();
}