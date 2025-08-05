import express from "express"
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import { validateUserLogin, validateUser } from "../middlewares/inputUserValidater.js"
import { isUserLoggedIn } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.route("/register")
    .post(validateUser,registerUser)


router.route("/login")
    .get(validateUserLogin ,loginUser)


router.route("/getProfile")
    .get(isUserLoggedIn , getUserProfile)


router .route("/logout")
    .get(isUserLoggedIn, logoutUser)


export default router