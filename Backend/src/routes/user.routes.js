import express from "express"
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import { validateLogin, validateUser } from "../middlewares/inputValidater.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.route("/register")
    .post(validateUser,registerUser)


router.route("/login")
    .get(validateLogin ,loginUser)


router.route("/getProfile")
    .get(isLoggedIn , getUserProfile)


router .route("/logout")
    .get(isLoggedIn, logoutUser)


export default router