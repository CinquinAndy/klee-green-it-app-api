require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
const db = require('./queries')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/tables',db.getTables);
app.get('/line/:table',db.getLineFromTable);
app.get(/^\/klee_.*/,db.dynamics);
app.post(/^\/klee_.*/, db.dynamicsBetweenDate);
app.get(/^\/average\/klee_.*/,db.dynamicsAverage);
app.post(/^\/average\/klee_.*/, db.dynamicsAverageBetweenDate);
app.get('/app/name/', db.getNameApplication);
app.post('/app/add/name/', db.postNameApplication);

app.listen(port, () => {
    console.log(`--> App Running on port ${port}`);
    console.log(`You can call now : http://localhost:${port}/tables to get all table's name`);
    console.log(`You can call now : http://localhost:${port}//line/:table to get all line's name from a table`);
    console.log(`You can call now : http://localhost:${port}/klee_<.*> to get all data from table's name`);
    console.log(`You can call now [with post 2 dates] : http://localhost:${port}/klee_<.*> to get all data from table's name between 2 dates`);
    console.log(`You can call now : http://localhost:${port}/average/klee_<.*> to get average data from table's name`);
    console.log(`You can call now [with post 2 dates] : http://localhost:${port}/average/klee_<.*> to get average data from table's name between 2 dates`);
});
