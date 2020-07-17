import Sequelize from 'sequelize'
import config from '../../config/test'
export const sequelize = new Sequelize(config)
export let Phone = sequelize.import(__dirname + '\\phone')
export let phoneDetail = sequelize.import(__dirname + '\\phone_detail')
sequelize.sync({force: true})