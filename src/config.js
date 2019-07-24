export default {
  database: 'test',
  username: 'root',
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}