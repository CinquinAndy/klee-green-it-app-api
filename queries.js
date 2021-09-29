require('dotenv').config();
const string = require("string-sanitizer");
const {Pool, query} = require('pg')
const {response, request} = require("express");
const regexTable = /^klee(.*)/;
var listTables = [];

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}
function sanitizeDate(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,:_-]/gim,"");
    return str.trim();
}

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
        var table = [];
        for (const row of result.rows) {
            if (row.table_name.match(/^klee(.*)/)) {
                table.push(row.table_name);
            }
        }
        response.status(200).json(table);
    })
}


const dynamics = (req, res) => {
    const params = sanitizeString(req.originalUrl.substring(1));
    pool.query(
        `SELECT * FROM ${params};`,
        (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const dynamicsBeetweenDate = (req, res) => {
    const params = sanitizeString(req.originalUrl.substring(1).replace(/\/.*$/,""));
    let { date_start, date_end } = req.query
    date_start=sanitizeDate(date_start)
    date_end=sanitizeDate(date_end)
    pool.query(`SELECT * FROM public.${params} where time between '${date_start}' and '${date_end}';`, (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).json(results.rows);
    })
}

module.exports = {
    dynamics,
    dynamicsBeetweenDate,
    getTables
}
