import express from "express"
import { loginUser, registerUser } from "../controllers/user.controller.js"
import { validateLogin, validateUser } from "../middlewares/inputValidater.js"
const router=express.Router()

router.route("/register")
    .post(validateUser,registerUser)


router.route("/login")
    .get(validateLogin ,loginUser)




export default router