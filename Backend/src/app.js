import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app= express()




app.use(cors({
    origin:"*",
    credentials:true 
}))


app.use(express())
app.use(express.json())
app.use(cookieParser())


import createUserTable from "./db/createUserTable.js"
import createCaptainTable from "./db/createCaptainTable.js"
createUserTable()
createCaptainTable()



import userRouter from "./routes/user.routes.js"
import captainRouter from "./routes/captain.routes.js"

app.use("/api/v1/user",userRouter)
app.use("/api/v1/captain",captainRouter)

export {app}