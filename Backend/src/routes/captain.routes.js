import express from "express"
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js"
import { validateCaptain, validateCaptainLogin } from "../middlewares/inputCaptainValidater.js"
import { isCaptainLoggedIn } from "../middlewares/auth.middleware.js"

const router=express.Router()

router.route("/register")
    .post(validateCaptain, registerCaptain)




router.route("/login")
    .get(validateCaptainLogin ,loginCaptain)


router.route("/getProfile")
    .get(isCaptainLoggedIn , getCaptainProfile)


router .route("/logout")
    .get(isCaptainLoggedIn, logoutCaptain)





export default router