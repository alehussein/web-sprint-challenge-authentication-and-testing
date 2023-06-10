const db = require('../../data/dbConfig')

async function add(user) {
  const [id] = await db('users').insert(user)

  return findById(id)
}

  function findById(id) {
    return db('users')
      .where({ id })
      .first()
  }

  async function findBy(filter) {
    const [user] = await db('users').where(filter)
    return user
  }

  function find() {
    return db('users').select('id', 'username')
  }

module.exports = {
    add,
    findById,
    findBy,
    find,
}