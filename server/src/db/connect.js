import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

let pool = undefined;
try {
  pool = new Pool(config);
} catch (error) {
  console.log("Failed create Postgres pool", error);
  console.log("Database config:", config);
  throw error;
}

export async function connect() {
  try {
    console.log("Attempting to connect to database.....");
    await pool.connect();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database", error);
    throw error;
  }
}

export default pool;