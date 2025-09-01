import { Sequelize } from "sequelize";

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = Number(process.env.DB_PORT);

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
});

export default db;