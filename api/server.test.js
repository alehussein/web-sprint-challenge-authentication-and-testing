// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const bcrypt = require('bcryptjs')
const secrets = require('./secrets')
const jwt = require('jsonwebtoken')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run({
    directory: './data/seeds'
  })
})

describe('[POST] /api/auth/register', () => {
  const porshe = { username: 'porshe', password: '1234' };

  test('add a user to the database', async () => {
    const res = await request(server).post('/api/auth/register').send(porshe);
    expect(res.status).toBe(201);
  });

  test('see all users in database', async () => {
    await request(server).post('/api/auth/register').send(porshe);
    expect(await db('users')).toHaveLength(4);
  });
  test('responds with a new user', async () => {
    const res = await request(server).post('/api/auth/register').send(porshe);
    expect(res.body).toMatchObject({ username: 'porshe' });
    await db('users').where({ username: 'porshe' }).del();
  });
});



describe('[POST] /api/auth/login', () => {
  test('should return a status of 200 on successful login', async () => {
    const user = { username: 'porsche', password: '1234' };
    // Hash the password
    const hashedPassword = bcrypt.hashSync(user.password, 8);
    // Insert the user into the database with the hashed password
    await db('users').insert({ username: user.username, password: hashedPassword });
    // Make a login request with the user's credentials
    const response = await request(server).post('/api/auth/login').send(user);
    expect(response.status).toBe(200);
    // Clean up: delete the user from the database
    await db('users').where({ username: user.username }).del();
  });
  test('Token exists', async () => {
    const user = { username: 'porsche', password: '1234' };
    const hashedPassword = bcrypt.hashSync(user.password, 8);
    await db('users').insert({ username: user.username, password: hashedPassword })
    const response = await request(server).post('/api/auth/login').send(user);
    expect(response.body.token).toBeDefined();

    await db('users').where({ username: user.username }).del();

  })
  test('Verificar Token', async () => {
    const user = { username: 'porsche', password: '1234' };
    const hashedPassword = bcrypt.hashSync(user.password, 8);
    await db('users').insert({ username: user.username, password: hashedPassword })
    const response = await request(server).post('/api/auth/login').send(user);
    const decodedToken = jwt.verify(response.body.token, secrets.JWT_SECRET);
    expect(decodedToken.username).toBe(user.username);

    await db('users').where({ username: user.username }).del();
  })

});

  
