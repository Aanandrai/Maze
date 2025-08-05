import Joi from "joi"
import { ApiError } from "../utills/ApiError.js"
import { asyncHandler } from "../utills/asyncHandler.js"


const userSchema=Joi.object({
    fullname: Joi.object({
        firstname: Joi.string().min(3).required(),
        lastname: Joi.string().min(3).optional(),
    }).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})

const validateUser=asyncHandler((req,res,next)=>{
    const {error}=userSchema.validate(req.body)
    if(error) throw new ApiError(400,error.details[0].message ||"Input data Validation fails")
    next()
})



const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(5).required()
})


const validateUserLogin=asyncHandler((req,res,next)=>{
    const {error}=loginSchema.validate(req.body)
    if(error) throw new ApiError(400 ,"Input data Validation fails")
    next()
})


export{validateUser,validateUserLogin}
