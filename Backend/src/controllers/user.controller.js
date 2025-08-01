import {asyncHandler} from "../utills/asyncHandler.js"
import { ApiError } from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js"
import { createUserService, findUserByEmailService } from "../services/user.service.js"

const registerUser =asyncHandler(async(req,res)=>{

    const {fullname , email,password}=req.body

    if(!fullname.firstname.trim() || !email.trim() || !password.trim() ){
        throw new ApiError(400 , "Name ,email or password can not be empty")
    }

    const user = await findUserByEmailService(email)

    if(user){
        throw new ApiError(409, "User already exist or dublicate email")
    }

    const newUser =await createUserService(fullname , email, password)

    console.log("newUser:",newUser)

    res.status(201).json(new ApiResponse(201, "User created successful",newUser))

})




export {registerUser}