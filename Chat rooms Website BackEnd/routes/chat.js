const { request } = require('express');
const express = require('express');
const router = express.Router();
const config = require('../utils/config.json');

router.get('/rooms', (request,response,next) =>{

   const chats=[
       {
           name:'python',
           
           id:1
       },
       {
           name: 'javascript',
           
           id:2
       },
       {
           name:'html' ,
           
           id:3
       },
       {
           name: 'css',
           
           id:4
       },
       {
           name: 'react' ,
           
           id:5
       },
   ]

    
    response.send({
        status:config.status_success,
        message:'success',
        data:chats
    })

});



module.exports = router