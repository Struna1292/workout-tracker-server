// check if there are environment variables
const environmentVariables = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_PORT',
    'ACCESS_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRATION',
    'REFRESH_TOKEN_SECRET',
    'REFRESH_TOKEN_EXPIRATION',
    'RESET_PASSWORD_TOKEN_SECRET',
    'RESET_PASSWORD_TOKEN_EXPIRATION',
    'GOOGLE_CLIENT_ID',
    'EMAIL_HOST',
    'EMAIL_PASSWORD',
];

const missing = [];

for (const variable of environmentVariables) {
    if (!process.env[variable]) {
        missing.push(variable);
    }
}

if (missing.length > 0) {
    
    for (const variable of missing) {
        console.log(`Missing environment variable: ${variable}`);
    }

    process.exit(1);
}