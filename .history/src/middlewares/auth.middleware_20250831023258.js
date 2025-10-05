import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next ) =>{
     try{
        
        const authHeader = req.header["authorization"];
        if(!authorization){
            return res.status(401).json({message:'no token to verify'})
        }
        const token = authHeader.split(" ")[1];

     }
}