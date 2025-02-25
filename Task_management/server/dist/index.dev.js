"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _pg = _interopRequireDefault(require("pg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Pool = _pg["default"].Pool;
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.set("view engine", "ejs"); // Configurar pool de conexões para PostgreSQL

var pool = new Pool({
  host: "localhost",
  user: "postgres",
  // Usuário do PostgreSQL
  password: "1234",
  // Senha do PostgreSQL
  database: "tictaskbd",
  // Nome do banco de dados
  port: 5432 // Porta padrão do PostgreSQL

}); // Rota inicial

app.get("/", function (req, res) {
  res.end("hello from nodejs");
}); // Rota para obter as tarefas de um usuário

app.get("/users", function _callee(req, res) {
  var username, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = req.query.username;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(pool.query("\n      SELECT * from tasks\n      WHERE tasks.username = $1\n    ", [username]));

        case 4:
          result = _context.sent;
          res.send(result.rows);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          res.status(500).send("Erro ao buscar tarefas.");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.get("/getcategories", function _callee2(req, res) {
  var username, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          username = req.query.username;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(pool.query("\n      SELECT * from  categoria\n      WHERE username = $1\n    ", [username]));

        case 4:
          result = _context2.sent;
          res.send(result.rows);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error(_context2.t0);
          res.status(500).send("Erro ao buscar tarefas.");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // Rota para login

app.post("/login", function _callee3(req, res) {
  var _req$body, username, password, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(pool.query("SELECT password FROM users WHERE username = $1", [username]));

        case 4:
          result = _context3.sent;

          if (result.rows.length > 0 && result.rows[0].password === password) {
            res.redirect("http://localhost:3000/users?username=".concat(username));
          } else {
            res.redirect("http://localhost:3000/invalid");
          }

          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error(_context3.t0);
          res.status(500).send("Erro ao realizar login.");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // Rota para criar uma nova tarefa

app.post("/createtask", function _callee4(req, res) {
  var _req$body2, newtask, username, newdescricao, newcheck, newtime_date, newtime_hour, category, fullTimestamp, name_c, final_category, categoryResult;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("Recebendo dados no backend:", req.body);
          _req$body2 = req.body, newtask = _req$body2.newtask, username = _req$body2.username, newdescricao = _req$body2.newdescricao, newcheck = _req$body2.newcheck, newtime_date = _req$body2.newtime_date, newtime_hour = _req$body2.newtime_hour, category = _req$body2.category;

          if (!(!username || !newtask || !newtime_date || !newtime_hour)) {
            _context4.next = 5;
            break;
          }

          console.error("Erro: campos obrigatórios ausentes.");
          return _context4.abrupt("return", res.status(400).json({
            error: "Campos obrigatórios ausentes."
          }));

        case 5:
          fullTimestamp = "".concat(newtime_date, " ").concat(newtime_hour, ":00");
          name_c = "Sem categoria";
          final_category = null;
          _context4.prev = 8;

          if (!category) {
            _context4.next = 14;
            break;
          }

          _context4.next = 12;
          return regeneratorRuntime.awrap(pool.query("SELECT nome FROM categoria WHERE id = $1", [category]));

        case 12:
          categoryResult = _context4.sent;

          if (categoryResult.rows.length > 0) {
            name_c = categoryResult.rows[0].nome;
            final_category = category;
          } else {
            console.warn("Aviso: Categoria com ID ".concat(category, " n\xE3o encontrada. Usando padr\xE3o."));
          }

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO tasks (username, tasks, descricao, feito, tempo, category_id, nome_categoria) \n       VALUES ($1, $2, $3, $4, $5, $6, $7)", [username, newtask, newdescricao || "", newcheck || false, fullTimestamp, final_category, name_c]));

        case 16:
          console.log("Tarefa adicionada com sucesso: ".concat(newtask, " para o usu\xE1rio ").concat(username));
          res.redirect("http://localhost:3000/users?username=".concat(username));
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](8);
          console.error("Erro ao criar tarefa:", _context4.t0);
          res.status(500).json({
            error: "Erro ao criar tarefa."
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[8, 20]]);
});
app.post("/createcategory", function _callee5(req, res) {
  var _req$body3, newcategory, username;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log("Recebendo dados no backend:", req.body); // <-- Adicionado para debug

          _req$body3 = req.body, newcategory = _req$body3.newcategory, username = _req$body3.username;
          console.log(req.body);

          if (username) {
            _context5.next = 6;
            break;
          }

          console.error("Erro: newtask ou username estão ausentes.");
          return _context5.abrupt("return", res.status(400).send("username inválido."));

        case 6:
          _context5.prev = 6;
          _context5.next = 9;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO categoria (username, nome) VALUES ($1,$2)", [username, newcategory]));

        case 9:
          res.redirect("http://localhost:3000/users?username=".concat(username));
          _context5.next = 16;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](6);
          console.error("Erro ao criar tarefa:", _context5.t0);
          res.status(500).send("Erro ao criar tarefa.");

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
app["delete"]("/deletecategory", function _callee6(req, res) {
  var categoryId, result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          categoryId = req.body.categoryId;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(pool.query("UPDATE tasks SET nome_categoria= NULL   WHERE category_id = $1", [categoryId]));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(pool.query("UPDATE tasks SET category_id = NULL   WHERE category_id = $1", [categoryId]));

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(pool.query("DELETE FROM categoria WHERE id = $1", [categoryId]));

        case 8:
          result = _context6.sent;

          if (!(result.rowCount === 0)) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).send("Categoria não encontrada."));

        case 11:
          res.send("Categoria deletada com sucesso.");
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](1);
          console.error(_context6.t0);
          res.status(500).send("Erro ao deletar categoria.");

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 14]]);
});
app.put("/feito/:id", function _callee7(req, res) {
  var id, feito;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          feito = req.body.feito; // Recebe true ou false

          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(pool.query("UPDATE tasks SET feito = $1 WHERE id = $2", [feito, id]));

        case 5:
          console.log("Tarefa ".concat(id, " atualizada para ").concat(feito));
          res.json({
            mensagem: "Status atualizado!",
            id: id,
            feito: feito
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);
          console.error("Erro ao atualizar tarefa:", _context7.t0);
          res.status(500).send("Erro ao atualizar tarefa.");

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 9]]);
}); // Rota para criar uma nova conta

app.post("/createacc", function _callee8(req, res) {
  var _req$body4, username, password, confirmpassword;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body4 = req.body, username = _req$body4.username, password = _req$body4.password, confirmpassword = _req$body4.confirmpassword;

          if (!(password === confirmpassword)) {
            _context8.next = 14;
            break;
          }

          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]));

        case 5:
          res.redirect("http://localhost:3000/acccreated");
          _context8.next = 12;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](2);
          console.error(_context8.t0);
          res.status(500).send("Erro ao criar conta.");

        case 12:
          _context8.next = 15;
          break;

        case 14:
          res.redirect("http://localhost:3000/passwordmismatch");

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 8]]);
}); // Rota para deletar uma tarefa

app["delete"]("/deletetask", function _callee9(req, res) {
  var _req$body5, task, username, result;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body5 = req.body, task = _req$body5.task, username = _req$body5.username;
          console.log(req.body);

          if (!(!task || !username)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            mensagem: "ID da tarefa e usuário são obrigatórios!"
          }));

        case 4:
          _context9.prev = 4;
          _context9.next = 7;
          return regeneratorRuntime.awrap(pool.query("DELETE FROM tasks WHERE id = $1 AND username = $2", [task, username]));

        case 7:
          result = _context9.sent;

          if (result.rowCount > 0) {
            res.json({
              mensagem: "Tarefa deletada com sucesso!"
            });
          } else {
            res.status(404).json({
              mensagem: "Tarefa não encontrada."
            });
          }

          _context9.next = 15;
          break;

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](4);
          console.error("Erro ao deletar tarefa:", _context9.t0);
          res.status(500).send("Erro ao deletar tarefa.");

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[4, 11]]);
}); // Rota para editar uma tarefa

app.put("/edittask/:id", function _callee10(req, res) {
  var id, _req$body6, tasks, descricao, tempo, nome_categoria, result;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          id = req.params.id;
          _req$body6 = req.body, tasks = _req$body6.tasks, descricao = _req$body6.descricao, tempo = _req$body6.tempo, nome_categoria = _req$body6.nome_categoria;
          _context10.prev = 2;
          _context10.next = 5;
          return regeneratorRuntime.awrap(pool.query("UPDATE tasks SET tasks = $1, descricao = $2, tempo = $3, nome_categoria = $4 WHERE id = $5 RETURNING *", [tasks, descricao, tempo, nome_categoria, id]));

        case 5:
          result = _context10.sent;

          if (!(result.rowCount === 0)) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            error: "Tarefa não encontrada"
          }));

        case 8:
          res.json({
            message: "Tarefa atualizada com sucesso!",
            task: result.rows[0]
          });
          _context10.next = 15;
          break;

        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](2);
          console.error("Erro ao editar a tarefa:", _context10.t0);
          res.status(500).json({
            error: "Erro interno do servidor"
          });

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[2, 11]]);
}); // Iniciar o servidor

app.listen(9000, function () {
  console.log("Server is running on port 9000");
});