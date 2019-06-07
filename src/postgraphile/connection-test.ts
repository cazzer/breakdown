import { Pool } from 'pg'

import db from '../database'
import epsagon from '../epsagon'
import * as config from '../config'

const pool = new Pool({
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  min: 0,
  max: 1
})

export default epsagon.lambdaWrapper(async () => {
  const result = await db.raw('select 1')
  console.log(result)
  return result
})

export const poolQuery = async () => {
  try {
    const connection = await pool.connect()
    const result = await connection.query('select now()')
    connection.release()
    debugger
    console.log('queried')
    console.log(result)
    return result
  }
  catch (error) {
    console.error(error)
    return
  }
}
