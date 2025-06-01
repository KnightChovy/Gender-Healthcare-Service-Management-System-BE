import { Sequelize } from 'sequelize'
import { env } from './environment.js'

let sequelizeInstance = null

const CONNECT_DB = async () => {
  sequelizeInstance = new Sequelize(env.MYSQL_DATABASE, env.MYSQL_USER, env.MYSQL_PASSWORD,
    {
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      dialect: 'mysql',
      logging: false
    })

  try {
    await sequelizeInstance.authenticate()
    console.log('Connection to MySQL has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error)
    throw error
  }
}

const CLOSE_DB = async () => {
  if (sequelizeInstance) {
    await sequelizeInstance.close()
    console.log('🔌 MySQL connection closed.')
  }
}

const GET_DB = () => {
  if (!sequelizeInstance) {
    throw new Error('Must connect to MySQL database first.')
  }
  return sequelizeInstance
}

export {
  CONNECT_DB,
  CLOSE_DB,
  GET_DB
}