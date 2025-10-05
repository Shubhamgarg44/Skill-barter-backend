import jwt from "jsonwebtoken";

// Middleware to protect routes
export const verifyToken = (req, res, next ) =>{
     try{
       
         // Tokens are usually sent in request headers: "Authorization: Bearer <token>"
        const authHeader = req.header["authorization"];
        if(!authorization){
            return res.status(401).json({message:'no token to verify'})
        }

        // Extract token (remove "Bearer ")
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) =>{
            if(err){
                return res.status.json({message:"token expired"});
            }

            req.user = user;
            next();
        })
     } catch(err){
        res.status()
     }
}