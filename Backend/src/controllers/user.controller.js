import {asyncHandler} from "../utills/asyncHandler.js"
import { ApiError } from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js"
import { createUserService, findUserByEmailExistService, findUserByEmailService } from "../services/user.service.js"
import JWT from "jsonwebtoken"
import bcrypt from "bcrypt"



const generateAccessToken=(user)=>{

    const expiresIn = '1h'

    const accessToken=JWT.sign(
        {
            id:user.id,
            email:user.email

        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn}
    )

    return {accessToken}

}








// Controller for register User 
const registerUser =asyncHandler(async(req,res)=>{

    const {fullname , email,password}=req.body

    if(!fullname.firstname.trim() || !email.trim() || !password.trim() ){
        throw new ApiError(400 , "Name ,email or password can not be empty")
    }

    const user = await findUserByEmailExistService(email)

    if(user){
        throw new ApiError(409, "User already exist or dublicate email")
    }

    const newUser =await createUserService(fullname , email, password)

    res.status(201).json(new ApiResponse(201, "User created successful",newUser))

})



// Controller for login user 
const loginUser =asyncHandler( async(req,res)=>{
    /*
    Take email,password
    check for empty field
    find the user
    compare the password
    generate access token
    send the token
    */
    const {email ,password}=req.body

    if(!email.trim() || !password.trim()){
        throw new ApiError(400,"Email or password is empty")
    }
    const userExist=await findUserByEmailExistService(email)


    if(!userExist){
        throw new ApiError(404, "User not found")
    }

    const user=await findUserByEmailService(email)
   


    if(!await bcrypt.compare(password,user.password)){
        throw new ApiError(401,"Invalid email or password")
    }

    const {accessToken}=generateAccessToken(user)

    user.password=undefined


    res.status(200).cookie(accessToken).json(new ApiResponse(200,"User login success", user))


})




export {registerUser , loginUser}