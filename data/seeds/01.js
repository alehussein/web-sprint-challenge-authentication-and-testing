/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'ian', password: 1234},
    {id: 2, username: 'monte', password: 1234},
    {id: 3, username: 'cary', password: 1234}
  ]);
};
