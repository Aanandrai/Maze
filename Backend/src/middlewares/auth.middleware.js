import jwt from "jsonwebtoken";
import { asyncHandler } from "../utills/asyncHandler.js";
import { findUserByEmailService } from "../services/user.service.js";
import { ApiError } from "../utills/ApiError.js";



const isLoggedIn=asyncHandler(async(req , res , next)=>{

    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

    if(!token){
        throw new ApiError(401 , "Unauthorised Access")
    }


    const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)


    const user=await findUserByEmailService(decodedToken.email)

    if(!user){
        throw new ApiError(401,"Invalid access token")
    }

    if( user.id!==decodedToken.id){
        throw new ApiError(400 , "Unauthorised Access")
    }

   
     user.password=undefined

    req.user=user

    next()

})

export {isLoggedIn}