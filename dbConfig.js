// import {loadEnvConfig} from '@next/env';


// const projectDir = process.cwd()
// loadEnvConfig(projectDir)



require("dotenv").config();


const { Pool } = require("pg");


const isProduction = process.env.NODE_ENV === "production";

const connectionString =  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;


const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: process.env.NODE_ENV === 'production'
    ? {rejectUnauthorized: false}
    : false,
});

module.exports = { pool };