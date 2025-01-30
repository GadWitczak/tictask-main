import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Configurar pool de conexões para PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres", // Usuário do PostgreSQL
  password: "1234", // Senha do PostgreSQL
  database: "mernapp", // Nome do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
});

// Rota inicial
app.get("/", (req, res) => {
  res.end("hello from nodejs");
});

// Rota para obter as tarefas de um usuário
app.get("/users", async (req, res) => {
  const username = req.query.username;
  try {
    const result = await pool.query("SELECT tasks FROM tasks WHERE username = $1", [username]);
    let text = result.rows.map((row, index) => `${index + 1}. ${row.tasks}`).join("\n");
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar tarefas.");
  }
});

// Rota para login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT password FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0 && result.rows[0].password === password) {
      res.redirect(`http://localhost:3000/users?username=${username}`);
    } else {
      res.redirect("http://localhost:3000/invalid");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao realizar login.");
  }
});

// Rota para criar uma nova tarefa
app.post("/createtask", async (req, res) => {
  const { newtask, username } = req.body;
  try {
    await pool.query("INSERT INTO tasks (username, tasks) VALUES ($1, $2)", [username, newtask]);
    res.redirect(`http://localhost:3000/users?username=${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar tarefa.");
  }
});

// Rota para criar uma nova conta
app.post("/createacc", async (req, res) => {
  const { username, password, confirmpassword } = req.body;
  if (password === confirmpassword) {
    try {
      await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
      res.redirect("http://localhost:3000/acccreated");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao criar conta.");
    }
  } else {
    res.redirect("http://localhost:3000/passwordmismatch");
  }
});

// Rota para deletar uma tarefa
app.post("/deletetask", async (req, res) => {
  let task = req.body.task.substring(2); // Remove os primeiros dois caracteres
  const { username } = req.body;

  console.log("Tentando deletar:", task, "do usuário:", username);

  try {
    const result = await pool.query("DELETE FROM tasks WHERE TRIM(tasks) = TRIM($1) AND username = $2", [task, username]);
    console.log("Linhas afetadas:", result.rowCount);

    if (result.rowCount > 0) {
      res.redirect(`http://localhost:3000/users?username=${username}`);
    } else {
      res.status(404).send("Tarefa não encontrada.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar tarefa.");
  }
});


// Iniciar o servidor
app.listen(9000, () => {
  console.log("Server is running on port 9000");
});