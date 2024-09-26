const express= require("express");
const router = express.Router() ;

const mainUser = require("./user")

router.use("user1",mainUser )

module.exports= router ;