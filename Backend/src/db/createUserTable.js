import pool from "./dbConnect.js"

const createUserTable =async()=>{
    const queryText=`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    
    firstname VARCHAR(255) NOT NULL CHECK (char_length(firstname) >= 3),
    lastname VARCHAR(255) CHECK (char_length(lastname) >= 3),
    
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    socketid VARCHAR(255)
    )`


    try{
        await pool.query(queryText)
        console.log("User table created if not exist")
    }catch(error){
        console.log("Error creating users table :" , error)
    }
}

export default createUserTable