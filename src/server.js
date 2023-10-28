//required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//port
const PORT=process.env.PORT || 3001;

const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
app.use('/users',require('../src/users/users.js'));


app.get('/',(req,res)=>{
    const jsonData={'Message':'Welcome To The CRUD SERVER','Paths':{'/users':'Get Users','/users/create':'Create User','/users/update':'Update User','/users/delete':'Delete User'},'Server':{'Github':'https://github.com/NAFIZ009/CRUD_APPLICATION'},'Author':{'Name':'Jalal Ahmed','Email':'jalalahmednafiz@gmail.com',
    'Linkedin':'https://www.linkedin.com/in/jalal-ahmed-nafiz-/','Github':'https://github.com/NAFIZ009'}};
    
    res.json(jsonData);
    

});

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