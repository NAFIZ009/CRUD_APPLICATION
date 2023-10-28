
const dataCol=["name","email","phone","age","profession"];
const dataValidation=(req,res,next)=>{
    //sent data from user
    let data;
    //validate variable
    let valid=true;
    // update method
    if(req.method=="PATCH")
    {
        data=req.body;
        if(Object.keys(data).length==2 && Object.keys(data).includes('id') && Object.keys(data).includes('update'))
        {
            //converting id string to num
            const num=+Object.values(data)[0];
            if(!isNaN(num)&&isFinite(num))
            {
                (Object.keys(data.update)).forEach(key=>{
                    if(!dataCol.includes(key))
                    {
                        valid=false;
                        return;
                    }
                });
                valid?next():res.status(400).send({status: 'Unsuccessful', message:'Invalid Update field'});
            }else
            {
                res.status(400).send({status: 'Unsuccessful', message:'Invalid ID'});
            }
        }else
        {
            res.status(400).send({status: 'Unsuccessful', message:'Invalid Data Format'});
        }
        return;
    }

    //Get method
    if(req.method=="GET")
    {
        data=req.query;
        (Object.keys(data)).forEach(key=>{
            if(!(dataCol.includes(key)||key=='id'))
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
    }

    // post method
    if(req.method=="POST"){
        data=req.body;
        //validating the properties of given data 
        (Object.keys(data)).forEach(key=>{
            if(!dataCol.includes(key))
            {
                valid=false;
                return;
            }
        });
        if(!valid)
        {
            res.status(400).send({status: 'Unsuccessful', message:'Invalid Data'});
            return;
        }
        
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
            
            if(!usersDataKeys.includes('age'))
            {
                req.body.age=-1;
            }
            if(!usersDataKeys.includes('profession'))
            {
                req.body.profession=null;
            }
        }else
        {
            res.status(400).send({status: 'Unsuccessful', message:'Name, Email or Phone Fields are missing'});
            return;
        }
    }

    //delete method
    if(req.method=='DELETE')
    {
        data=req.query;
        const num =+ data.id;
        if(!(Object.keys(data).length==1&&Object.keys(data)[0]=='id'&&!(isNaN(num)&&isFinite(num))))
        {
            res.status(400).send({status: 'Unsuccessful', message:'Give valid ID'});
            return;
        }
    }
    next();
}

module.exports=dataValidation;