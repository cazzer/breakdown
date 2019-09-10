import knex from 'knex'

import { DB_ENDPOINT } from './config'

const db = knex({
  connection: DB_ENDPOINT,
  dialect: 'pg',
  pool: {
    max: 1,
    min: 0,
  },
})

export default db
