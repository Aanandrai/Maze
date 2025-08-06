import Joi from "joi"

import { ApiError } from "../utills/ApiError.js"
import { asyncHandler } from "../utills/asyncHandler.js"



// Captian register validation 
const captainSchema=Joi.object({
    fullname:Joi.object({
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).optional()
    }).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(5).required(),
    status:Joi.string().valid('active','inactive','banned').optional(),

    carInfo:Joi.object({
        color:Joi.string().min(3).required(),
        plate:Joi.string().min(4).required(),
        capacity:Joi.number().min(1).required(),
        vehicle_type :Joi.string().valid('car','bike','auto').required()
    }).required()
    
})

const validateCaptain=asyncHandler(async(req, _ , next)=>{
    const {error}=captainSchema.validate(req.body)

    if(error) throw new ApiError(401,error.message)
    next()
})




// Captain Login validation 
const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(5).required()
})


const validateCaptainLogin=asyncHandler((req,_,next)=>{
    const {error}=loginSchema.validate(req.body)
    if(error) throw new ApiError(400 ,"Input data Validation fails")
    next()
})



export {validateCaptain ,validateCaptainLogin}