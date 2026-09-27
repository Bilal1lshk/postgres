import { Client } from "pg";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());
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

app.get("/all", async (req, res) => {
  const result = await client.query(`SELECT * FROM todo`);
  res.json({
    message: "Todo API is working",
    data: result.rows
  });
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await client.query(`DELETE FROM todo WHERE id = ${id}`)
  res.json({
    message: "todo deleted successfully",
    result
  })
})
app.put('/edit/:id', async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const result = await client.query(`
    UPDATE todo
    SET title = '${title}'
    WHERE id = ${id}
    RETURNING *
  `);

  res.json({
    message: "Todo API is working",
    data: result.rows
  });
})
app.post("/todo", async (req, res) => {
  const { title } = req.body
  const result = await client.query(`
    INSERT INTO todo (title)
    VALUES ('${title}')
`);
  res.json({
    reply: "done ha biru",
    result
  })
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default client;