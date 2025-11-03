// check if there are environment variables
const environmentVariables = [
    'PORT',
    'DB_HOST',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
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
    'EMAIL_USER',
    'EMAIL_LIMIT',
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

if (process.env.EXERCISES_IN_WORKOUT_LIMIT == null) process.env.EXERCISES_IN_WORKOUT_LIMIT = 50;
if (process.env.SETS_IN_EXERCISE_LIMIT == null) process.env.SETS_IN_EXERCISE_LIMIT = 30;
if (process.env.EXERCISES_IN_TEMPLATE_LIMIT == null) process.env.EXERCISES_IN_TEMPLATE_LIMIT = 50;
if (process.env.SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT == null) process.env.SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT = 100;

console.log(`Exercises in workout limit: ${process.env.EXERCISES_IN_WORKOUT_LIMIT}`);
console.log(`Sets in exercise limit: ${process.env.SETS_IN_EXERCISE_LIMIT}`);
console.log(`Exercises in template limit: ${process.env.EXERCISES_IN_TEMPLATE_LIMIT}`);
console.log(`Scheduled workouts in week schedule limit: ${process.env.SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT}`);