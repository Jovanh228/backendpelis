import User from '../models/user.models.js'
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


//funcion  para registrar usuarios
// req <---request sirve para recibir datos del navegador(front)
//res  <---responser sirve para enviar datos al navegador 


export const register = async (req, res)=>{
    const {username, email, password} = req.body; 

    
 try {
  // vallidamos que el email no se haya regisrado 
  const userFound = await User.findOne({email});
  if(userFound){
    return res.status(400)
    .json({message: ["El email ya esta en uso"]})
  }
    const passwordHash = await bcryptjs.hash(password, 10);
     const newUser  = new User({
         username,
         email,
         password: passwordHash
     });
  
   const userSaved = await newUser.save();
   const token = await createAccessToken({id: userSaved._id});
   res.status(200).cookie('token', token,{
       secure: true,
      // httpOnly: true,
      sameSite: 'none'
    
   });
   res.json({
     id: userSaved._id,
     username: userSaved.username,
     email: userSaved.email


   });
 
     //res.send("Registrando");
 } catch (error) {
  console.log(error);
 }
};//fin de registro 


export const login = async (req, res)=>{
      const {email, password} = req.body;
      try {
        const userFound = await User.findOne({email});
        if(!userFound){
          return res.status(400)
            .json({massage: 'Usuario no encontrado'});
        }
        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch){
          return res.status(400).json({message: 'Password no coincide'})
        }
        const token = await createAccessToken({id: userFound._id})
        res.status(200).cookie('token', token,{
          secure: true,
         // httpOnly: true,
          sameSite: 'none'

         });
        res.json({
          id: userFound._id,
          username: userFound.username,
          email: userFound.email
        });
        
      } catch (error) {
        console.log(error);
      }
}

export const logout =(req, res)=>{
  res.clearCookie("token");
  return res.sendStatus(200);
}//fin fr logout



// unico para perfil del usurios

export const profile = async (req, res)=>{
  const userFound = await User.findById(req.user.id);


  if(!userFound)
    return res.status(400).json({message: "user not found"});

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email
  })
}//fin de profile 
export const verifyToken = async (req, res)=>{
const {token} = req.cookies;
      if(!token)
      return res.status(401).json({message: ["No autorizado"]});
    
jwt.verify(token, TOKEN_SECRET, async(err, user)=>{
  if(err)
    return res.status(401).json({message: ["No aitorizado"]});
  const userFound = await User.findById(user.id);
  if (!userFound)
    return res.status(401).json({message: ["No autorizado"]});


    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
  })
})
}