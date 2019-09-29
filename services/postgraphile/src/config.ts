export const DB_HOST = process.env.DB_HOST || 'breakdown-pg'
export const DB_NAME = process.env.DB_NAME || 'test'
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = parseInt(process.env.DB_PORT) || 5432
export const DB_SCHEMA = process.env.DB_SCHEMA || 'breakdown'
export const DB_USER = process.env.DB_USER || 'postgres'

export const DB_ENDPOINT = encodeURI(
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
)

export const EPSAGON_TOKEN = process.env.EPSAGON_TOKEN
export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
