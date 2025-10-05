// Temporary in-memory wallet balances (replace with DB later)
const wallet = {};

// ------------------ get wallet -----------------------
export const getWallet = (req,res) =>{
    const userEmail = req.user.email;
    const balance = wallet[userEmail] || 100;
    res.json({
        email: userEmail,
        balance
    })
    
}

// --------------------- add token -------------------------
export const addTokens = (req, res) =>{
    const userEmail = req.user.email;
    const {amount} = req.body;

    if(!amount || amount <0){
        return res.status(400).json({message: "Invalid Token Amount"});
    }
    wallet[userEmail] = (wallet[userEmail] || 100) + amount;
    
    res.json({
        message:`Amount ${amount} added successfully`,
        balance: wallet[userEmail]
    });
};


// ------------------------ deduct token ----------------------------
 export const deductTokens=(req, res) =>{
    const userEmail = req.user.email;
    const {amount} = req.body;

    if(!amount || amount <0){
        return res.status(400).json({message: "Invalid Token Amount"});
    }

    const currentBalance = wallet[userEmail] || 100;

    if (currentBalance < amount) {
        return res.status(400).json({ message: "insufficient balance" });
    }
    

    wallet[userEmail] = currentBalance - amount;
    res.json({ message: `${amount} tokens deducted`, balance: wallet[userEmail] });
 }