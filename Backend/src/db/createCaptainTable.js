import pool from "./dbConnect.js"

const createCaptainTable= async()=>{
    const queryText=`
    CREATE TABLE IF NOT EXISTS captain (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL CHECK(char_length(firstname) >=3),
    lastname VARCHAR(255) CHECK(char_length(lastname)>3),

    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    socketId VARCHAR(255) ,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'banned')),
    location geography(Point, 4326)
    `

    const queryTextCreateVehicleType=`
    CREATE TABLE IF NOT EXISTS vehicle_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK(type in ('car','bike','auto'))
    )`

    const queryVehicle=`
    CREATE TABLE IF NOT EXISTS vehicle (
    id SERIAL PRIMARY KEY,
    captain_id INT REFERENCES captain(id),
    color VARCHAR(255) NOT NULL CHECK(char_length(color)>3),
    plate VARCHAR(255) NOT NULL CHECK(char_length(plate)>3),
    capacity INT NOT NULL CHECK(capacity>=1),
    vehicle_type_id INT REFERENCES vehicle_type(id)
    )
    `
    try{
        await pool.query(queryText)
        await pool.query(queryTextCreateVehicleType)
        await pool.query(queryVehicle)
        console.log("table create successfully")
    }catch(error){
        console.log("error in creating captain table", error)
    }
}

export {createCaptainTable}
