//database data schema
/*
    id int(11) PK 
    name varchar(30) not null
    email varchar(50) not null
    phone char(11) not null
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
    if(!valid)
    {
        res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'});
        return;
    }

    if(req.method=="POST"){
        const usersDataKeys=Object.keys(data);
        if(usersDataKeys.includes('name')&&usersDataKeys.includes('email')&&usersDataKeys.includes('phone'))
        {
            let {name, email, phone}=data;
            name=name.replace(/\s/g, '');
            email=name.replace(/\s/g, '');
            phone=name.replace(/\s/g, '');
            if(name.length==0||email.length==0||phone.length==0)
            {
                res.status(400).send({status: 'Unsuccessful', message:'Name, Email or Phone value is required'});
                return;
            }
        }else
        {
            res.status(400).send({status: 'Unsuccessful', message:'Name, Email or Phone Fields are missing'});
            return;
        }
    }
    next();
}

module.exports=dataValidation;