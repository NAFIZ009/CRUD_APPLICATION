//required packages
const express = require('express');
const cors = require('cors');
//API Functions
const getFunc=require('./api_Func/getFunc');
const postFunc=require('./api_Func/postFunc');
const updateFunc = require('./api_Func/updateFunc');
const deleteFunc = require('./api_Func/deleteFunc');
//custom packages
const dataValidation= require('../middleware/dataValidation');

const router = express();

//middleware
router.use(cors());
router.use(express.json());

//API
//GET router
router.get('/',dataValidation,getFunc);
//POST router
router.post('/create',dataValidation,postFunc);
//UPDATE router
router.patch('/update',dataValidation,updateFunc);
//delete router
router.delete('/delete',dataValidation,deleteFunc);

module.exports=router;