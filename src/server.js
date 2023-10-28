//required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
//port
const PORT=process.env.PORT || 3001;
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
app.get('/users',dataValidation,(req,res,next)=>{
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
                if(result.length==0)
                {
                    res.status(400).send({status:'Unsuccessful',massage:"Data not found"});
                    return;
                }
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
        const {name , email , phone ,age , profession }=data;

        //sql
        const sqlQuery=`insert into users(name,email,phone,age,profession) values ('${name}','${email}','${phone}',${age},'${profession}')`;

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
                res.send({status:'Successful',result:{id:result.insertId,...data}});    
            }

            //releasing the connection
            connection.release();
        })
    });
});
//UPDATE router
app.patch('/users',dataValidation,(req,res,next)=>{
    /*
        {
            "id": "value"
            update:{
                "field":"value",
                .... : ....
            }
        }
    */
    //data
    const body=req.body;
    console.log(body);
    pool.getConnection((err,connection)=>{

        // if any error occurs
        if(err) {
            next(err);
        }
        
        //SQL query basis on the query parameters given by the user 
        let elementString='';
        Object.keys(body.update).forEach((key,index)=>{
           elementString+=`${key}='${body.update[key]}'`;
           if(index<Object.keys(body.update).length-1)
           {
                elementString+=',';
           }
        })

        const sqlQuery=`UPDATE users SET ${elementString} WHERE ${Object.keys(body)[0]} = ${Object.values(body)[0]};
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
                    // res.send({status:'Successful', message:`User is Updated`});
                    res.redirect(`/users?id=${Object.values(body)[0]}`);
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
    //taking a connection from the pool
    pool.getConnection((err,connection)=>{
        // if any error occurs
        if(err) {
            next(err);
        }

        //converting string to number
        const num =+ query.id;
        
        //SQL query basis on the query parameters given by the user 
        const sqlQuery=`DELETE FROM users
        WHERE id = ${num};
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
    console.log(err.message);
    if(err.message.includes('ER_DUP_ENTRY'))
    {
        res.status(400);
        if(err.message.includes('unique_constraint_name2')){
            res.send({status: 'Unsuccessful', message:`Duplicate Data in Phone Number`});
        }else if(err.message.includes('unique_constraint_name'))
        {
            res.send({status: 'Unsuccessful', message:`Duplicate Data in Email`});
        }else
        {
            res.send({status: 'Unsuccessful', message:`Duplicate Data in Email and Phone Number`});
        }
    }else
    {
        res.status(500).send({status:'error',message:'Server Error'});
    }
    
});

//listening server
app.listen(PORT,()=>{
    console.log('listening on port '+PORT);
});