//mysql pool connection 
const pool=require('../../config/pool');

const updateFunc=(req,res,next)=>{
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
};
module.exports =updateFunc;