import { Client } from "pg";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = 5000;

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
});

await client.connect();

console.log("PostgreSQL connected");

app.get("/done", (req, res) => {
  console.log("done done");

  res.json({
    message: "Todo API is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default client;