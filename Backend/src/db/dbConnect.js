import pkg from "pg"
import dotenv from "dotenv"


dotenv.config({
    path:".env"

})

const {Pool}=pkg

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT

})


pool.on("connect",()=>{
    console.log("Connection pool establised with Database")
})

export default pool