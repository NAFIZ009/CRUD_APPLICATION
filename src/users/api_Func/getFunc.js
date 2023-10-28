//mysql pool connection 
const pool=require('../../config/pool');


const getFunc=(req,res,next)=>{
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
        connection?.query(sqlQuery,(err,result)=>{
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
}

module.exports=getFunc;