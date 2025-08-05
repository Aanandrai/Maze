import Joi from "joi"

import { ApiError } from "../utills/ApiError.js"
import { asyncHandler } from "../utills/asyncHandler.js"


const captainSchema=Joi.object({
    fullname:Joi.object({
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).optional()
    }).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(5).required(),
    status:Joi.string().valid('active','inactive','banned').optional(),

    carInfo:Joi.object({
        color:Joi.string().min(4).required(),
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



export {validateCaptain}