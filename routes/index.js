const express = require('express')
const router = express.Router()

router.get('/',(request,response)=>{
    response.json(
        {
            "statusCode":100,
            "message": "Hello"
        }
    )
});






module.exports = router