// Temporary in-memory "skills" array (replace with DB later)
const skills = [];

// --------------offer skill ----------------
export const offerSkill = (req, res) => {
    const{title, description, tokens} = req.body;

    // each skill linked to user who offers it 
    const newSkill = {
        id: skills.length+1,
        title,                     // => basically naya objetc bana k sskill array of objetc m daal do jo filhaaal deonmy hai 
        description,
        tokens,
        offeredBy: req.user.email,
    };
    skills.push(newSkill);
    res.status(201).json({ message: "skills offered successfully", skill: newSkill });

};

// --------------------get all skill  --------------------------
export const getSkills = (req, res) => {
    res.json(skills);
  };

// ----------------- Request Skill -----------------
export const requestSkill = (req, res) => {
    const { id } = req.params;
    const skill = skills.find(s => s.id === parseInt(id));
  
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
  
    // Later: Deduct tokens from requester, add to provider (wallet logic)
    res.json({
      message: `You have requested the skill: ${skill.title}`,
      requestedFrom: skill.offeredBy,
      requestedBy: req.user.email,
    });
  };