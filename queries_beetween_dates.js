require('dotenv').config();
const {Pool} = require('pg')
const {response} = require("express");

const pool = new Pool(
    {
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORTPG
    }
);

// -------------- Get all informations from all tables - beetween 2 dates ------------------
const get_disk_read_write_rates = pool.query('select * from disk_read_write_rates;', (error, result) => {
            if (error) {
                    throw error
            }
            response.status(200).json(result.rows)
    }
);
