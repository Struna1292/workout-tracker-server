import db from './db.js';

import './models/associations.js';

const ENVIRONEMENT = process.env.ENVIRONEMENT;

try {
    await db.sync({ alter: ENVIRONEMENT == 'production' });
    console.log('Database tables synchronised.');
}
catch (error) {
    console.error('Database tables sync failed:', error);
    process.exit(1);
}