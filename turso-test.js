import { createClient } from "@libsql/client"
import "dotenv/config"
import { faker } from "@faker-js/faker"


const client = createClient({
  url: "file:local.db",
  syncUrl: process.env.TURSO_SYNC_URL,
  authToken: process.env.TURSO_DB_TOKEN,
})

const tableName = 'tursotest'

// check create table
try {
  await client.execute({
    sql: `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY, data TEXT NOT NULL)`,
    args: [],
  })
} catch (e) {
  console.log("error!!", e.message)
}

let i = 0
let rows = []
while (i < 1000) {
  const name = faker.person.fullName() // Rowan Nikolaus
  const email = faker.internet.email() // Kassandra.Haley@erich.biz
  const jobTitle = faker.person.jobTitle()
  const company = faker.company.name()
  const country = faker.location.country()
  rows.push(JSON.stringify({ name, email, jobTitle, company, country }))

  i++
}
const data = rows.map((n) => {
  return {
    sql: `INSERT INTO ${tableName} (data) VALUES (?)`,
    args: [n],
  }
})
// insert the data
//console.log('data', data)
try {
  const res = await client.batch(data, "write")
  console.log("batch write ok")
} catch (e) {
  console.log("error!!", e.message)
}