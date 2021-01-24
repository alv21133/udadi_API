'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionHistorySchema extends Schema {
  up() {
    this.create('action_histories', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('type', 1).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('action_histories')
  }
}

module.exports = ActionHistorySchema
