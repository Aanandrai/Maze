import pool from "../db/dbConnect.js"


const findCaptainByEmailExistService=async(email)=>{

    const result=await pool.query(`SELECT id FROM captain WHERE email=$1`,[email])
    return result?.rows[0]

}


const createNewCaptainService=async(fullname, email,password, carInfo)=>{
    console.log(fullname.firstname,fullname.lastname)
    const result1=await pool.query(`INSERT INTO captain(firstname,lastname,email,password) VALUES($1,$2,$3,$4) returning *`,[fullname.firstname, fullname.lastname,email,password])


    const userinfo=result1.rows[0]
    const result2=await pool.query(`INSERT INTO vehicle(captain_id,color,plate,capacity,vehicle_type) VALUES($1,$2,$3,$4, $5) returning *`,[userinfo.id,carInfo.color,carInfo.plate ,carInfo.capacity, carInfo.vehicle_type ])



    
    userinfo.carInfo=result2.rows[0]
    return userinfo
}


export {findCaptainByEmailExistService,createNewCaptainService}