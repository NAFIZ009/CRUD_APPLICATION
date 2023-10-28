//mysql pool connection 
const pool=require('../../config/pool');

const postFunc=(req,res,next)=>{
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

        connection?.query(sqlQuery,(err,result)=>{
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
};

module.exports = postFunc;