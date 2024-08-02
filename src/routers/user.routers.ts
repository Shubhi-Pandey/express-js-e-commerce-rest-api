
import express from "express";
import bcrypt from 'bcryptjs';
import { User } from "../entities/user.entity";
const router = express.Router();
const jwt = require('jsonwebtoken');
import { appDataSource } from "../dataSource";

router.get('/', async (req, res) =>{
    console.log("welcome user!");
    
})


router.post('/register', async (req, res) => {
   // const {name,email,password,phone,isAdmin,street,apartment,zip,city,country}=req.body;
   if(req.body.name==undefined || req.body.name==null || req.body.name==''){
    return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Name should be valid or not blank!",
    });
}
if(req.body.email==undefined || req.body.email==null || req.body.email==''){
    return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Email should be valid or not blank!",
    });
}
if(req.body.password==undefined || req.body.password==null || req.body.password==''){
   return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Password should be valid or not blank!",
    });
}
if(req.body.phone==undefined || req.body.phone==null || req.body.phone==''){
   return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Phone should be valid or not blank!",
    });
}
  
if(req.body.city==undefined || req.body.city==null || req.body.city==''){
   return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "City should be valid or not blank!",
    });
}
if(req.body.country==undefined || req.body.country==null || req.body.country==''){
   return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Country should be valid or not blank!",
    });
}

const checkUserEmail = await appDataSource.getRepository(User).findOne({
    where: {
        email: req.body.email,
    },
});
  if(checkUserEmail){
    return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "User already exists!",
    });
}
else{
    let hashedPassword= bcrypt.hashSync(req.body.password, 10) 
   const user = appDataSource.getRepository(User).create({
    ...req.body,  // Spread other properties
    passwordHash: hashedPassword, // Use hashed password
});
   // console.log(user)
   const rawUserData = await appDataSource.getRepository(User).save(user);
    if(!rawUserData){
       return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "User can not be created!",
          });
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User has been created successfully!",
      });
  }
})

router.delete('/:id', async (req, res) => {
   const userId=req.params.id;
   try {
    const userRepository = await appDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      return res.status(400).json({
            status: false,
            statusCode: 400,
            message: "User cannot be found!",
          });
    }

    await userRepository.remove(user);
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User deleted successfully!",
      });
   
} catch (err) {
  return res.status(400).json({
        status: false,
        statusCode: 400,
        error:err.message,
      });
}
})


router.post('/login', async (req, res) => {
    const userExist = await appDataSource.getRepository(User).findOne({
        where: {
            email: req.body.email,
        },
    });
    const secret = process.env.secret;
    if(!userExist) {
      return res.status(400).json({
            status: true,
            statusCode: 400,
            message: "User with given Email not found!",
          });
    }
   else{
    if(userExist && bcrypt.compareSync(req.body.password, userExist.passwordHash)) {
        const token = jwt.sign({
            userID: userExist.id,
            isAdmin : userExist.isAdmin
        }, secret, {expiresIn : '1d'} )
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "User loggedIn successfully!",
            data:{Email: userExist.email, token: token}
          });
          
    } else {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: "Password is mismatched!",
          });
        }
   }
})


router.get('/allusers',async(req,res)=>{
    const allUserList=await appDataSource.getRepository(User).find();
    if(!allUserList){
      return res.status(400).json({
            status: false,
            statusCode: 400,
            message: "No record found!",
          });
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Users fetched successfully!",
        allUserList
      });
})

router.get('/:id',async(req,res)=>{
    const userData=await appDataSource.getRepository(User).findOne({
        where:{
              id:req.params.id
        }
    });
    if(!userData){
      return res.status(400).json({
            status: false,
            statusCode: 400,
            message: "No record found!",
          });
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User record fetched successfully!",
        userData
      });
})


router.get('/get/count', async (req, res) => {
    try {
        const userCount = await appDataSource.getRepository(User).count();
     // Return user count in JSON format
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "All user count!",
            userCount
          });
         
    } catch (err) {
        console.error(err);
      return  res.status(500).json({
            status: false,
            statusCode: 500,
            message: "Internal server error!",
          });
    }
});


 module.exports=router