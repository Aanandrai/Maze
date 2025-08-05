import express from "express"
import { registerCaptain } from "../controllers/captain.controller.js"
import { validateCaptain } from "../middlewares/inputCaptainValidater.js"

const router=express.Router()

router.route("/register")
    .post(validateCaptain, registerCaptain)


export default router