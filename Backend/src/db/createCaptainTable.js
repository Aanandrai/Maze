import pool from "./dbConnect.js"

const createCaptainTable= async()=>{
    const queryText=`
    CREATE TABLE IF NOT EXISTS captain (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL CHECK(char_length(firstname) >=3),
    lastname VARCHAR(255) CHECK(lastname IS NULL OR char_length(lastname)>=3),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    socketId VARCHAR(255) ,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'banned')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
    
    )`

    // location geography(Point, 4326)    this powerfull tool to calculate the location related 

    const queryTextCreateVehicleType=`
    DO $$
    BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_enum') THEN
        CREATE TYPE vehicle_enum AS ENUM ('car', 'bike', 'auto');
    END IF;
    END$$;`

    const queryVehicle=`
    CREATE TABLE IF NOT EXISTS vehicle (
    id SERIAL PRIMARY KEY,
    captain_id INT REFERENCES captain(id) NOT NULL,
    color VARCHAR(255) NOT NULL CHECK(char_length(color)>=3),
    plate VARCHAR(255) NOT NULL CHECK(char_length(plate)>3),
    capacity INT NOT NULL CHECK(capacity>=1),
    vehicle_type vehicle_enum NOT NULL
    )
    `
    try{
    //     await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
        await pool.query(queryText)
        await pool.query(queryTextCreateVehicleType)
        await pool.query(queryVehicle)
        console.log("table create successfully")
    }catch(error){
        console.log("error in creating captain table", error)
    }
}

export default createCaptainTable
