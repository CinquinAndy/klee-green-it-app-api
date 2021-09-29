require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {request, response} = require("express");
const app = express();
const port = process.env.PORT;
const db = require('./queries')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


app.get('/', (request, response) => {
        response.json({info: 'node.js , express and postgres API'});
    }
);

app.get('/tables', db.getTables);
app.get('/disk_read_write_rates', db.get_disk_read_write_rates);
app.get('/disk_performance', db.get_disk_performance);
app.get('/memory_cpu', db.get_memory_cpu);
app.get('/filesystem_space_utilization', db.get_filesystem_space_utilization);
app.get('/in_network', db.get_in_network);
app.get('/out_network', db.get_out_network);
app.get('/cpu_iowait_time', db.get_cpu_iowait_time);
app.get('/cpu_utilization', db.get_cpu_utilization);
app.get('/memory_utilization', db.get_memory_utilization);
app.get('/send_receive', db.get_send_receive);
app.get('/logged_in_users', db.get_logged_in_users);

app.listen(port, () => {
    console.log(`App Running on port ${port}`);
})


