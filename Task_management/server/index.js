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
  password: "password", // Senha do PostgreSQL
  database: "postgres", // Nome do banco de dados
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
    const result = await pool.query("SELECT * FROM tasks WHERE username = $1", [username]);
   
    res.send(result.rows);
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
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { novofeito }  = req.body; // Pegando 'feito' do corpo da requisição
  console.log(req.body)
  console.log("ID:", id, "Feito Atual:", novofeito);

  console.log(`🔄 Recebida atualização: id=${id}, feito=${novofeito}`);

  // Verifica se 'feito' foi enviado corretamente
  if (feito === undefined) {
    console.error("❌ Erro: O campo 'feito' está indefinido.");
    return res.status(400).json({ error: "O campo 'feito' é obrigatório e deve ser true ou false." });
  }

  try {
    const result = await pool.query(
      "UPDATE tasks SET feito = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [feito, id]
    );

    if (result.rowCount > 0) {
      console.log("✅ Tarefa atualizada com sucesso:", result.rows[0]);
      res.status(200).json({ message: "✅ Tarefa atualizada com sucesso!", task: result.rows[0] });
    } else {
      console.error("❌ Erro: Tarefa não encontrada.");
      res.status(404).json({ error: "❌ Tarefa não encontrada." });
    }
  } catch (err) {
    console.error("❌ Erro ao atualizar a tarefa:", err);
    res.status(500).send("Erro ao atualizar a tarefa.");
  }
});
// Rota para criar uma nova tarefa
app.post("/createtask", async (req, res) => {
  console.log("Recebendo dados no backend:", req.body); // <-- Adicionado para debug

  const { newtask, username,newdescricao,newcheck} = req.body;
    console.log(req.body)
  if (!username) {
    console.error("Erro: newtask ou username estão ausentes.");
    return res.status(400).send("username inválido.");
  }

  try {
    await pool.query("INSERT INTO tasks (username, tasks,descricao,feito) VALUES ($1,$2,$3,$4)", [username, newtask,newdescricao,newcheck
    ]);
    console.log(`Tarefa adicionada com sucesso: ${newtask} para o usuário ${username} $`);
    res.redirect(`http://localhost:3000/users?username=${username}`);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
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