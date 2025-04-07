// config/database.js
import { Sequelize } from 'sequelize';
import { readFileSync } from 'fs';

const env = process.env.NODE_ENV || 'development';
const configPath = new URL('./config.json', import.meta.url);
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
});

export default sequelize;
