import { createNewCaptainService, findCaptainByEmailExistService, findCaptainByEmailService } from "../services/captain.service.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import bcrypt from "bcrypt"



// Access Token generator 
const generateAccessToken=(captain)=>{

    const expiresIn = '1h'

    const accessToken=JWT.sign(
        {
            id:captain.id,
            email:user.email,
            role:"Captain"

        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn}
    )

    return {accessToken}

}





// Controller for register Captain
const registerCaptain=asyncHandler(async(req , res)=>{
/*
take out all the info from body
No check because all the check is perform by Joi as middleware
check for user exist with this email & throw error
create new captain with this e-mail & other related table
*/


const {fullname,email,password,carInfo}=req.body


const isCaptainExist=await findCaptainByEmailExistService(email)

if(isCaptainExist){
    throw new ApiError(409,"Captain already exists")
}

const createCaptain=await createNewCaptainService(fullname,email,password,carInfo)


res.status(200).json(new ApiResponse(200, "captain create Successfully",createCaptain))

})




//Controller for login Captain
const loginCaptain=asyncHandler(async (req,res)=>{
    const {email , password}=req.body

    const captain=await findCaptainByEmailService(email)

    if(!captain){
        throw new ApiError(404, "Captain not found")
    }

    if(!await bcrypt.compare(password , captain.password)){
        throw new ApiError(402, "Invalid email or password")
    }


    const {accessToken}=generateAccessToken(captain)

    captain.password=undefined

     const options={httpOnly:true , secure:true , sameSite: "Strict"}

    res.status(200)
        .cookie("accessToken",accessToken,options)
        .json(new ApiResponse(200, "Captain login success"),captain)

})




// Controller for login User 
const getCaptainProfile=asyncHandler(async(req,res)=>{
     res.status(200).json(new ApiResponse(200,"Getting User captain successfull",req.captain))
})


// Controller for Captain logout 
const logoutCaptain=asyncHandler(async(req,res)=>{
    const options={httpOnly:true , secure:true , sameSite: "Strict"}
    
    res.status(200).clearCookie("accessToken",options).json(new ApiResponse(200,"User logout success"),{})
})

export {registerCaptain , loginCaptain , getCaptainProfile , logoutCaptain}