import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const DB_PORT = Number(process.env.DB_PORT);

const db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
});

try {
    await db.authenticate();
    console.log('Connection to database has been established successfully.');
} 
catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
}

export default db;