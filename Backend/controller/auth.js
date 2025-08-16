const User = require("../model/auth");
const bcrypt = require('bcrypt');
jwt = require('jsonwebtoken');
require("dotenv").config();


exports.signup = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password ){
            return res.status(400).json({
                success:false,
                messase:"all field are required"
            })
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }
        const hassPassword =await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password:hassPassword
        })
        await newUser.save();

        return res.status(200).json({
            success:true,
            message:"account created successfully",
             user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// login controller
exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all field are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"account does not exist"
            })
        }
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                id:user._id,
                eamil:user.email
            }
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRATE,
                { expiresIn:"2h",}
             );
             user.token = token;
             user.password= undefined;
        }
        else{
            console.log("password does not match");
            return res.status(400).json({
                success:false,
                message:"password does not match",
            })
        }
        return res.status(200).json({
            success:true,
            message:"login successfully"
        })
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}