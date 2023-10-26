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
    let data;
    if(req.method=="POST"){
        data=req.body;
    }else if(req.method=="GET"){
        data=req.query;
    }
    let valid=true;
    (Object.keys(data)).forEach(key=>{
        if(!dataCol.includes(key))
        {
            valid=false;
            return;
        }
    });

    //data is valid
    valid?next():res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'});
}

module.exports=dataValidation;