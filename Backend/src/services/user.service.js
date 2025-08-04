import bcrypt from "bcrypt"
import pool from "../db/dbConnect.js"

const findUserByEmailExistService=async(email)=>{

    const result=await pool.query(`SELECT id FROM users WHERE email=$1`,[email])
    return result.rows[0]

}


const findUserByEmailService=async(email)=>{

    const result=await pool.query(`SELECT * FROM users WHERE email=$1`,[email])
    return result.rows[0]

}


const createUserService =async(fullname , email, password)=>{

    const firstname=fullname.firstname
    const lastname=fullname.lastname
    const newPassword =await bcrypt.hash(password,10)


    // we can use just returning * but we can accidently expose password pr sockeid so 
    //only taking from db which we need
    const result=await pool.query(`INSERT INTO users (firstname ,lastname ,email,password) VALUES ($1,$2,$3,$4) returning id,firstname,lastname,email`,[firstname,lastname,email,newPassword])
    
    return result.rows[0]
}

export {findUserByEmailExistService,createUserService , findUserByEmailService}
