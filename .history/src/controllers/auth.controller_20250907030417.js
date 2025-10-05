import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// later replace it with db =>
const users = [];

// -------signup----------
export const signup = async(req,res) =>{
    try{
        const {name, email, password} = req.body;
        
        // check if user already exist
       const existingUser = users.find(u => u.email ===email);
       if(existingUser){
        return res.status(400).json({ message: "user already exist" });
       }

       // ----Hash Password----
       const hashedPassword = await bcrypt.hash(password,10);

       // --- Store user mock for now later replace it with db =>
         const newUser =  {id:users.length + 1, name, email, password:hashedPassword};
         users.push(newUser);

         res.status(201).json({message:"User registered successfully",
          user :{id: newUser.id, name: newUser.name, email: newUser.email}});
    }
    catch(error){
        res.status(500).json({message:"signup failed",
    error:error.message})
    }
}



// ------------------login --------------------------
export const login = async(req,res) =>{
    try {
   const {email, password} = req.body;

   // find user
   const user = users.find(u => u.email === email);
   if(!user){
     return res.status(404).json({message: "user not fouund"})
   }

   // compare password 
   const isMatch =await bcrypt.compare(password, user.password);
   if(!isMatch){
   return res.status(401).json({messgae:"invalid credential"});
   }

   // Generate jwt token
   const token = jwt.sign(
    {id:user.id,
     email: user.email
    },
    process.env.JWT_SECRET || "secretkey",
    {expiresIn: "1h"}
   );
   res.json({message: "login successful", token});
} catch(err){
    res.status(500).json({message:"login failed", error: err.message})
}
}
