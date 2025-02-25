import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Configurar pool de conexões para PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres", // Usuário do PostgreSQL
  password: "1234", // Senha do PostgreSQL
  database: "tictaskbd", // Nome do banco de dados
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
    const result = await pool.query(
      `
      SELECT * from tasks
      WHERE tasks.username = $1
    `, [username]);

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar tarefas.");
  }
});

app.get("/getcategories", async (req, res) => {
  const username = req.query.username;
  try {
    const result = await pool.query(
      `
      SELECT * from  categoria
      WHERE username = $1
    `, [username]);

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

// Rota para criar uma nova tarefa
app.post("/createtask", async (req, res) => {
  console.log("Recebendo dados no backend:", req.body);

  const { newtask, username, newdescricao, newcheck, newtime_date, newtime_hour, category } = req.body;

  if (!username || !newtask || !newtime_date || !newtime_hour) {
    console.error("Erro: campos obrigatórios ausentes.");
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const fullTimestamp = `${newtime_date} ${newtime_hour}:00`;
  let name_c = "Sem categoria";
  let final_category = null;

  try {
    if (category) {
      const categoryResult = await pool.query(
        "SELECT nome FROM categoria WHERE id = $1",
        [category]
      );

      if (categoryResult.rows.length > 0) {
        name_c = categoryResult.rows[0].nome;
        final_category = category;
      } else {
        console.warn(`Aviso: Categoria com ID ${category} não encontrada. Usando padrão.`);
      }
    }

    await pool.query(
      `INSERT INTO tasks (username, tasks, descricao, feito, tempo, category_id, nome_categoria) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [username, newtask, newdescricao || "", newcheck || false, fullTimestamp, final_category, name_c]
    );

    console.log(`Tarefa adicionada com sucesso: ${newtask} para o usuário ${username}`);
    res.redirect(`http://localhost:3000/users?username=${username}`);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
});

app.post("/createcategory", async (req, res) => {
  console.log("Recebendo dados no backend:", req.body); // <-- Adicionado para debug

  const { newcategory, username} = req.body;
    console.log(req.body)
  if (!username) {
    console.error("Erro: newtask ou username estão ausentes.");
    return res.status(400).send("username inválido.");
  }

  try {
    await pool.query("INSERT INTO categoria (username, nome) VALUES ($1,$2)", [username, newcategory]);
    res.redirect(`http://localhost:3000/users?username=${username}`);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
    res.status(500).send("Erro ao criar tarefa.");
  }
});



app.delete("/deletecategory", async (req, res) => {
  const { categoryId } = req.body;

  try {
    // ⚠️ Primeiro, remova a categoria das tasks que a utilizam, para evitar erro de chave estrangeira
    await pool.query("UPDATE tasks SET nome_categoria= NULL   WHERE category_id = $1", [categoryId]);
    await pool.query("UPDATE tasks SET category_id = NULL   WHERE category_id = $1", [categoryId]);

    // 🔥 Agora, delete a categoria
    const result = await pool.query("DELETE FROM categoria WHERE id = $1", [categoryId]);

    if (result.rowCount === 0) {
      return res.status(404).send("Categoria não encontrada.");
    }

    res.send("Categoria deletada com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao deletar categoria.");
  }
});




app.put("/feito/:id", async (req, res) => {
  const { id } = req.params;
  const { feito } = req.body; // Recebe true ou false

  try {
      await pool.query("UPDATE tasks SET feito = $1 WHERE id = $2", [feito, id]);
      console.log(`Tarefa ${id} atualizada para ${feito}`);
      res.json({ mensagem: "Status atualizado!", id, feito });
  } catch (err) {

      console.error("Erro ao atualizar tarefa:", err);
      res.status(500).send("Erro ao atualizar tarefa.");
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
app.delete("/deletetask", async (req, res) => {
  const { task, username } = req.body;
  console.log(req.body)
  if (!task || !username) {
      return res.status(400).json({ mensagem: "ID da tarefa e usuário são obrigatórios!" });
  }

  try {
      const result = await pool.query(
          "DELETE FROM tasks WHERE id = $1 AND username = $2",
          [task, username]
      );

      if (result.rowCount > 0) {
          res.json({ mensagem: "Tarefa deletada com sucesso!" });
      } else {
          res.status(404).json({ mensagem: "Tarefa não encontrada." });
      }
  } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      res.status(500).send("Erro ao deletar tarefa.");
  }
});

// Rota para editar uma tarefa
app.put("/edittask/:id", async (req, res) => {
  const { id } = req.params;
  const { tasks, descricao, tempo, nome_categoria } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET tasks = $1, descricao = $2, tempo = $3, nome_categoria = $4 WHERE id = $5 RETURNING *",
      [tasks, descricao, tempo, nome_categoria, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa atualizada com sucesso!", task: result.rows[0] });
  } catch (error) {
    console.error("Erro ao editar a tarefa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// Iniciar o servidor
app.listen(9000, () => {
  console.log("Server is running on port 9000");
});