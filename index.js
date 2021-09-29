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

app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/tables',db.getTables);
app.get(/^\/klee_.*/,db.dynamics);
app.post(/^\/klee_.*/, db.dynamicsBeetweenDate);

app.listen(port, () => {
    console.log(`App Running on port ${port}`);
});
