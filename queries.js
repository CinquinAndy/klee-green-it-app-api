require('dotenv').config();
require("string-sanitizer");
const {Pool} = require('pg');

// from w3c official post
function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}

// from w3c official post [ modify to don't sanitize ":" ]
function sanitizeDate(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,:_-]/gim, "");
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

// get all tables name, from a regex sql query
const getTables = (req, res) => {
    pool.query('SELECT table_name FROM information_schema.tables where table_name ~ \'^klee(.*)\';', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows);
    })
}

// get all lines from a table name, regex sql query too
const getLineFromTable = (req, res) => {
    const params = sanitizeString(req.originalUrl.replace(/^\/line\//, ""));
    if (params.match(/^klee(.*)/)) {
        pool.query(`select *
                    from (select column_name
                          from information_schema.columns
                          where table_schema = 'public'
                            and table_name = '${params}') as result
                    where column_name != 'time'
                      and column_name != 'unite';`, (error, result) => {
            if (error) {
                throw error
            }
            res.status(200).json(result.rows);
        })
    } else {
        res.status(200).json({error: "aucune tables n'existe avec ce nom"})
    }
}

// get all values from a table
const dynamics = (req, res) => {
    const params = sanitizeString(req.originalUrl.substring(1));
    if (params.match(/^klee(.*)/)) {
        pool.query(`SELECT *
                    FROM ${params};`, (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows);
        })
    } else {
        res.status(200).json({error: "aucune tables n'existe avec ce nom"})
    }
}

// get all values from a table between 2 dates
const dynamicsBetweenDate = (req, res) => {
    const params = sanitizeString(req.originalUrl.substring(1).replace(/\/.*$/, ""));
    if (params.match(/^klee(.*)/)) {
        let {date_start, date_end} = req.query
        date_start = sanitizeDate(date_start)
        date_end = sanitizeDate(date_end)
        if (date_start > date_end) {
            // if the starting date is higher than the end, then swap the values
            let date_temp = date_start
            date_start = date_end
            date_end = date_temp
        }
        pool.query(`SELECT *
                    FROM public.${params}
                    where time between '${date_start}' and '${date_end}';`, (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).json(results.rows);
        })
    } else {
        res.status(200).json({error: "aucune tables n'existe avec ce nom"})
    }
}

// get average values from all line of a table -> parameter : only name of the table
const dynamicsAverage = (req, res) => {
    // match string started by /average/ , and delete it
    let params = req.originalUrl.replace(/^\/average\//, "");
    // match string started by "klee" and finished by / or end of the line
    params = sanitizeString(params.replace(/\/.*$/, "").match(/^klee(.*)/)[0]);
    // if params started by "klee" the url was valid, then we can give a response
    if (params.match(/^klee(.*)/)) {
        let arrayColumn = [];
        pool.query(`select *
                    from (select column_name
                          from information_schema.columns
                          where table_schema = 'public'
                            and table_name = '${params}') as result
                    where column_name != 'time'
                      and column_name != 'unite';`, (error, results) => {
            if (error) {
                throw error
            }
            for (const row of results.rows) {
                for (const rowKey in row) {
                    arrayColumn.push(row[rowKey])
                }
            }
            let queryPrep = "";
            for (const arrayColumnKey in arrayColumn) {
                queryPrep += ((arrayColumnKey == 0) ? "" : ",") +
                    `AVG(${arrayColumn[arrayColumnKey]}) as "${arrayColumn[arrayColumnKey]}"`;
            }
            pool.query(`select ${queryPrep}
                        from ${params};`, (errorSecondQuery, resultsSecondQuery) => {
                if (errorSecondQuery) {
                    throw errorSecondQuery
                }
                res.status(200).json(resultsSecondQuery.rows);
            })
        })
    } else {
        res.status(200).json({error: "aucune tables n'existe avec ce nom"})
    }
}

// get average values from all line of a table, between 2 dates
const dynamicsAverageBetweenDate = (req, res) => {
    // match string started by /average/ , and delete it
    let params = req.originalUrl.replace(/^\/average\//, "");
    // match string started by "klee" and finished by / or end of the line
    params = sanitizeString(params.replace(/\/.*$/, "").match(/^klee(.*)/)[0]);
    // if params started by "klee" the url was valid, then we can give a response
    if (params.match(/^klee(.*)/)) {
        let {date_start, date_end} = req.query
        date_start = sanitizeDate(date_start)
        date_end = sanitizeDate(date_end)
        if (date_start > date_end) {
            // if the starting date is higher than the end, then swap the values
            let date_temp = date_start
            date_start = date_end
            date_end = date_temp
        }
        let arrayColumn = [];
        pool.query(`select *
                    from (select column_name
                          from information_schema.columns
                          where table_schema = 'public'
                            and table_name = '${params}') as result
                    where column_name != 'time'
                      and column_name != 'unite';`, (error, results) => {
            if (error) {
                throw error
            }
            for (const row of results.rows) {
                for (const rowKey in row) {
                    arrayColumn.push(row[rowKey])
                }
            }
            let queryPrep = "";
            for (const arrayColumnKey in arrayColumn) {
                queryPrep += ((arrayColumnKey == 0) ? "" : ",") +
                    `AVG(${arrayColumn[arrayColumnKey]}) as "${arrayColumn[arrayColumnKey]}"`;
            }
            pool.query(`select ${queryPrep}
                        from ${params}
                        where time between '${date_start}' and '${date_end}';`, (errorSecondQuery, resultsSecondQuery) => {
                if (errorSecondQuery) {
                    throw errorSecondQuery
                }
                res.status(201).json(resultsSecondQuery.rows);
            })
        })
    } else {
        res.status(200).json({error: "aucune tables n'existe avec ce nom"})
    }
}

module.exports = {
    dynamics,
    dynamicsBetweenDate,
    dynamicsAverage,
    dynamicsAverageBetweenDate,
    getLineFromTable,
    getTables
}
