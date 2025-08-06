import jwt from "jsonwebtoken";
import { asyncHandler } from "../utills/asyncHandler.js";
import { findCaptainByEmailService } from "../services/captain.service.js";
import { ApiError } from "../utills/ApiError.js";



const isUserLoggedIn=asyncHandler(async(req , res , next)=>{

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



const isCaptainLoggedIn=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

    if(!token){
        throw new ApiError(401 , "Unauthorised Access")
    }


    const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)


    const captain=await findCaptainByEmailService(decodedToken.email)

    if(!captain){
        throw new ApiError(401,"Invalid access token")
    }

    if( captain.id!==decodedToken.id){
        throw new ApiError(400 , "Unauthorised Access")
    }

   
    captain.password=undefined

    req.captain=captain

    next()

})

export {isUserLoggedIn,isCaptainLoggedIn}