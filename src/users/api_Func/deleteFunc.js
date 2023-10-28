//mysql pool connection 
const pool=require('../../config/pool');

const deleteFunc=(req,res,next)=>{
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
};

module.exports=deleteFunc;