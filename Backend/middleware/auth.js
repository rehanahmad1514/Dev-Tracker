const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) =>{
    try{
        const token = req.body.token ||
                      req.headers['authorization'];
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token is missing"
            })
        }
        try{
             const decode = await jwt.verify(token, process.env.JWT_SECRATE);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}