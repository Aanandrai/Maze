import { createNewCaptainService, findCaptainByEmailExistService } from "../services/captain.service.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";


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



export {registerCaptain}