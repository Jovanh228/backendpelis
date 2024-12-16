import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


// fincion para generar un token de inicio de sesion 

export function createAccessToken(payload){
    return new Promise (  (resolve, reject)=>{
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d"
            },
            (err,token)=>{
                if (err){
                    reject(err);
                    console.log(err)
                }
                resolve(token)
            }
        )
    
    })
}