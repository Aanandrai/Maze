import express from "express"
import { registerUser } from "../controllers/user.controller.js"
import { validateUser } from "../middlewares/inputValidater.js"
const router=express.Router()

router.route("/register")
    .post(validateUser,registerUser)




export default router