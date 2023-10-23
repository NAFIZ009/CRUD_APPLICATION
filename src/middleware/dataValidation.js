//database data schema
/*
    id int(11) PK 
    name varchar(10) 
    gender set('M','F') 
    email varchar(20) 
    phone char(11) 
    age int(11) 
    photo longblob 
    country varchar(20) 
    address varchar(20) 
    proffession varchar(20) 
    relagion varchar(20)
*/
const dataCol=["id","name","gender","email","phone","age","photo","country","address","proffession","relagion"];
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