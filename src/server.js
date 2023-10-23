//required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');

const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

//mysql pool connection 
const pool=mysql.createPool({
    connectionLimit:20,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

//API

app.get('/users',(req,res,next)=>{
    //query params
    const query=req.query;
    //taking a connection from the pool
    pool.getConnection((err,connection)=>{
         // if any error occurs
         if(err) {
            next(err);
        }
        
        //SQL query basis on the query parameters given by the user 
        const sqlQuery=Object.keys(query).length===0?'select * from users':`select * from users where ${Object.keys(query)[0]} = '${Object.values(query)[0]}' or ${Object.keys(query)[0]} like '%${Object.values(query)[0]}%'`;

        //getting data
        connection.query(sqlQuery,(err,result)=>{
            
            //if any error occurs
            if(err) {
                //releasing the connection
                connection.release();
                next(err);
            }else
            {
                //sending data
                res.send({status:'Successful',result});    
            }

            //releasing the connection
            connection.release();
        });
    });
});

//Error handling middleware
app.use((err,req,res,next)=>{
    res.status(500).send({status:'error',message:'Server Error'});

});

//listening server
app.listen(process.env.PORT,()=>{
    console.log('listening on port '+process.env.PORT);
})