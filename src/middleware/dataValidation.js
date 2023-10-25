//database data schema
/*
    id int(11) PK 
    name varchar(30) 
    email varchar(50) 
    phone char(11) 
    age int(11) 
    profession varchar(30) 
*/
const dataCol=["name","email","phone","age","profession"];
const dataValidation=(req,res,next)=>{
    //sent data from user
    const data=req.body;
    (Object.keys(data)).forEach(key=>{
        if(!dataCol.includes(key))
        {
            res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'})
            return;
        }
    });

    //data is valid
    next();
}

module.exports=dataValidation;