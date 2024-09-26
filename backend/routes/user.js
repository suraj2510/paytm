const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const user = require("../models/db.js");
const  { authMiddleware } = require("../middleware");

const signUp = zod.object({
  username: zod.string().email(),
  password: zod.string().min(8, "Password must contain atleast word"),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const success = signUp.safeParse(body);

  if (!success) {
    return res.status(411).json({
      msg: "Inputs or passsword are incorrects / Email alraedy taken",
    });
  }

  const existedUser = await user.findOne({
    username: req.body.username,
  });
  if (existedUser) {
    return res.status(411).json({
      msg: "Inputs or passsword are incorrects / Email alraedy taken",
    });
  }

  const newuser = await user.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastNmae: req.body.lastNmae,
  });
  const userId = newuser._id;
  const token = jwt.sign({ userId, JWT_SECRET });

  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signin = zod.object({
  username: zod.string().email(),
  password: zod.string().min(8, "Password must contain atleast word"),
});

router.post("/signin", async (req, res) => {
  const { success } = signin.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }
  const user = await user.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if(user){
    const token = jwt.sign({userId:user._id } ,JWT_SECRET)

    res.json({
        token:token
    })
    return
  }
  res.status(411).json({
    message: "Error while logging in"
})
});  

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.put("bulk",async(req,res)=>{
    const filter =req.query.filter || "" 
    const user = await user.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: user.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;
