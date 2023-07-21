const skillsSchema = require("./skills.model");

exports.addSkills = async (req, res) => {
  try {
    let skillExist = await skillsSchema.findOne({ skill: req.body.skill });
    if (skillExist) {
      return res.status(400).send({ message: "Skill already exists" });
    }

    let obj = {
      skill: req.body.skill,
    };

    let skillReq = new skillsSchema(obj);
    skillReq.save().then(() => {
      res.send({
        message: "Skill added successfully",
      });
    });
  } catch (err) {
    console.log("Error Caught");
  }
};

exports.findAllSkills = async (req, res) => {
  try {
    let skillRes = await skillsSchema.find();
    res.status(200).send(skillRes);
  } catch (err) {
    console.log("Error Caught");
  }
};
