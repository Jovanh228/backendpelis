import { TOKEN_SECRET } from "../config.js";
import jwt from 'jsonwebtoken';



export const authRequired = (req, res, next)=>{
   
  
 //obyenemos las cookies
 const {token} =  req.cookies;
 if(!token)
    return res.status(401).json({message: ['No token, autorizacion denegada']})

 jwt.verify(token, TOKEN_SECRET, (err, user) =>{
    if(err)
        return res.status(403).json({message: ['token invalido']}) 
    //console.log(user);
      // guardamos los datos del usuario en el objeto req
   req.user = user;
    next();

})
 
}//fin de authRequired