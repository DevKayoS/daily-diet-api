/* eslint-disable prettier/prettier */
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.string('name', 255).notNullable()
    table.text('description')
    table.dateTime('date_time').notNullable()
    table.boolean('enter_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
