//required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
//custom packages
const dataValidation= require('./middleware/dataValidation');

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
//GET router
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
//POST router
app.post('/users',dataValidation,(req,res,next)=>{
    //sent data from user
    const data=req.body;
    //getting connection from the pool
    pool.getConnection((err,connection)=>{
        // if any error occurs
        if(err) {
            next(err);
        }

        //data 
        const {id, name , gender , email , phone ,age , photo , country , address , proffession , relagion}=data;

        //sql
        const sqlQuery=`insert into users values (${id},'${name}','${gender}','${email}','${phone}',${age},'','${country}','${address}','${proffession}','${relagion}')`;

        connection.query(sqlQuery,(err,result)=>{
             //if any error occurs
            if(err) {
                //releasing the connection
                connection.release();
                next(err);
                return;
            }else
            {
                //sending data
                res.send({status:'Successful',result:data});    
            }

            //releasing the connection
            connection.release();
        })
    });
});
//UPDATE router
app.patch('/users',dataValidation,(req,res,next)=>{
    //data
    const body=req.body;
    if(Object.values(body)[0].length==0)
    {
        res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'})
        return;
    }

    pool.getConnection((err,connection)=>{
        // if any error occurs
        if(err) {
            next(err);
        }
        
        //SQL query basis on the query parameters given by the user 
        let elementString='';
        Object.keys(body.update).forEach((key,index)=>{
           elementString.concat(`${key}=${body.update[key]}`);
           if(index!=Object.keys(body.update).length)
           {
            elementString.concat(',');
           }
        })


        const sqlQuery=`UPDATE your_table SET ${elementString} WHERE ${Object.keys(body)[0]} = ${Object.values(body)[0]};
        `;

        //getting data
        connection.query(sqlQuery,(err,result)=>{
    
            //if any error occurs
            if(err) {
                //releasing the connection
                connection.release();
                next(err);
            }else
            {
                // Check the affectedRows property for checking is data is deleted
                if (result.affectedRows === 0) {
                    // Data not found
                    res.status(400).send({status:'Unsuccessful', message:'No matching data found for Update'});
                } else {
                    // Data were deleted successfully
                    res.send({status:'Successful', message:`User is Updated`})
                } 
            }

            //releasing the connection
            connection.release();
        });
    });
});
//delete router
app.delete('/users',dataValidation,(req,res,next)=>{
    //query params
    const query=req.query;
    if(Object.values(query)[0].length==0)
    {
        res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'})
        return;
    }
    //taking a connection from the pool
    pool.getConnection((err,connection)=>{
        // if any error occurs
        if(err) {
            next(err);
        }
        
        //SQL query basis on the query parameters given by the user 
        const sqlQuery=`DELETE FROM users
        WHERE ${Object.keys(query)[0]} = ${Object.values(query)[0]};
        `;

        //getting data
        connection.query(sqlQuery,(err,result)=>{
    
            //if any error occurs
            if(err) {
                //releasing the connection
                connection.release();
                next(err);
            }else
            {
                // Check the affectedRows property for checking is data is deleted
                if (result.affectedRows === 0) {
                    // Data not found
                    res.status(400).send({status:'Unsuccessful', message:'No matching data found for deletion'});
                } else {
                    // Data were deleted successfully
                    res.send({status:'Successful', message:`User is deleted`})
                } 
            }

            //releasing the connection
            connection.release();
        });
    });

})

//Error handling middleware
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).send({status:'error',message:'Server Error'});
});

//listening server
app.listen(process.env.PORT,()=>{
    console.log('listening on port '+process.env.PORT);
})