const express= require("express")
const app = express();
const cors= require("cors")
const jwt= require("jsonwebtoken")
const mainRouter = require("./routes/index.js")


app.use(express.json())
app.use(cors())
app.use("/api/v1", mainRouter)

app.listen(3000)