#klee-green-it-app-api
Projet to have an API with express.js and postgresql  

## Description
all routes are dynamics, we don't know all tables names, we want a full access, without needing to change the code on each changes.

## Routes : 
````
- to get all table's name -
http://localhost:3000/tables 
````

````
- to get all line's name from a table -
http://localhost:3000//line/:table 
````

````
- to get all data from table's name -
http://localhost:3000/klee_<.*>
````

````
- to get all data from table's name between 2 dates -
! [with post request 2 dates]  ! 
- date_start
- date_end
http://localhost:3000/klee_<.*> 
````

````
- to get average data from table's name -
http://localhost:3000/average/klee_<.*>
````

````
- to get average data from table's name between 2 dates -
! [with post request 2 dates]  ! 
- date_start
- date_end
http://localhost:3000/average/klee_<.*>
````

## install
create a ``.env`` file, with the following example options:
````
PORT=3000
HOST= localhost
USER= postgres
DATABASE= testdb
PASSWORD= 123
PORTPG= 5432
````
then just run the project with a classic ``npm install`` & ``node index.js``
