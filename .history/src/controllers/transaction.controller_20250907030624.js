const transactions = [];
import { getSkills } from "./skill.controller.js";
import { getWallet, addTokens, deductTokens } from "./wallet.controller.js"; 
// (later replaced with DB teammate’s schema)

// ---------------- create transactin ------------------
export const createTransaction = (req,res) =>{
    try{
    const {skillId} = req.params;
    const buyerEmail = req.user.email;

     // For now, simulate skills array (later DB teammate handles it)
     const skill = global.skills?.find(s => s.id == parseInt(skillId));
     if(!skill){
        return res.status(404).json({message:"no skills fount"});
     }

     // prevent self purchase
     if(skill.offeredBy == buyerEmail){
        return res.status(400).json({message:"you cannot buy your own skill"});
     }

     // deduct token from buyer
     const buyerBalance = (global.wallets && global.wallets[buyerEmail]) || 100;

     if(buyerBalance < skill.tokens){
        return res.status(400).json({message:"insuffient balance"});
     }
     
     global.wallets[buyerEmail] = buyerBalance - skill.tokens;

     // add token to seller
     const sellerBalance = global.wallets?.[skill.offeredBy] || 100;
     global.wallets[skill.offeredBy] = sellerBalance + skill.tokens;

     // record transaction

     const transaction = {
        id:transactions.length + 1,
        skill: skill.title,
        tokens: skill.tokens, 
        buyer:buyerEmail,
        seller:skill.offeredBy,
        status: "completed",
        date: new Date().toISOString(),
     };
     transactions.push(transaction);

     res.status(201).json({message:"Transaction successfully",
    transaction,
    buyerBalance: global.wallets[buyerEmail],
    sellerBalance: global.wallets[skill.offeredBy],
    })
} catch(err){
    res.status(500).json({ message: "error in transaction", error: err.message });

}
}

// --------------------- Get my transaciton -----------------------
export const getMyTransactions = (req,res) =>{
    const userEmail = req.user.email;
    const myTxns = transactions.filter(
        t => t.buyer === userEmail || t.seller === userEmail
    );
    res.json(myTxns);
};

