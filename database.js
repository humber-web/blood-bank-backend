const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: "postgres://default:rMLtWjlH4R6a@ep-calm-cell-a4mxa0lw-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require?sslmode=require",
})