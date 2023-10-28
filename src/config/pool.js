//require mysql
const mysql = require('mysql');
//mysql pool connection 
const pool=mysql.createPool({
    connectionLimit:20,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

module.exports=pool;