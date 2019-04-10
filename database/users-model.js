const db = require('./dbConfig');

module.exports = {
    insert,
    findByUsername,
    findById
}

function insert (user) {
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