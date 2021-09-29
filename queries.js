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

const getTables = (request, response) => {
    pool.query('SELECT * FROM information_schema.tables;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows);
    })
}

// Get all informations from all tables
const get_disk_read_write_rates = pool.query('select * from disk_read_write_rates;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_disk_performance = pool.query('select * from disk_performance;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_memory_cpu = pool.query('select * from memory_cpu;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_filesystem_space_utilization = pool.query('select * from filesystem_space_utilization;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_in_network = pool.query('select * from in_network;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_out_network = pool.query('select * from out_network;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_cpu_iowait_time = pool.query('select * from cpu_iowait_time;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_cpu_utilization = pool.query('select * from cpu_utilization;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_memory_utilization = pool.query('select * from memory_utilization;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_send_receive = pool.query('select * from send_receive;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);
const get_logged_in_users = pool.query('select * from logged_in_users;', (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).json(result.rows)
    }
);

module.exports = {
    getTables,
    get_disk_read_write_rates,
    get_disk_performance,
    get_memory_cpu,
    get_filesystem_space_utilization,
    get_in_network,
    get_out_network,
    get_cpu_iowait_time,
    get_cpu_utilization,
    get_memory_utilization,
    get_send_receive,
    get_logged_in_users,
}
