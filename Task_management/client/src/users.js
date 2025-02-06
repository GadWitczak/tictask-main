import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pop_up from './pop_up';
import './style.css';
import './bootstrap.css';

const Callapi1 = () => {
  const [tasks, setTask] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());
  const date = new Date(timestamp);
  const search = useLocation().search;
  const username = new URLSearchParams(search).get('username');
  
  useEffect(() => {
    fetch(`http://localhost:9000/users?username=${username}`)
      .then((res) => res.json())
      .then((data) => setTask(data))
      .catch((error) => console.error("Erro ao buscar os dados:", error));
  }, [username]);

  const toggleFeito = async (id, feitoAtual) => {
    try {
      const response = await fetch(`http://localhost:9000/feito/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feito: !feitoAtual }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      setTask((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, feito: !feitoAtual } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const deletarTarefa = async (taskId) => {
    try {
      const response = await fetch("http://localhost:9000/deletetask", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskId, username }),
      });

      const data = await response.json();
      console.log(data.mensagem);

      setTask((tarefas) => tarefas.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>Usuário:</strong> {task.username} <br />
            <strong>Tarefa:</strong> {task.tasks} <br />
            <strong>Criado em:</strong> {task.descricao} <br />
            {date > new Date(task.tempo) ? "acabou o tempo" : "no prazo"} <br />
            {new Date(task.tempo).toLocaleDateString('pt-BR')}
            <br />
            <button onClick={() => toggleFeito(task.id, task.feito)}>
              {task.feito ? "Desmarcar" : "Marcar"}
            </button>
            <button className="btn btn-danger" onClick={() => deletarTarefa(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Getusername = () => {
  const search = useLocation().search;
  const [pop, setPop] = useState(false);
  const username = new URLSearchParams(search).get('username');
  
  return (
    <>
      <h1>Olá, {username}</h1>
      <form action="http://localhost:9000/createcategorie" method="POST" className="form-group">
        <input type="text" className="form-control-lg" name="newcategorie" />
        <input type="hidden" name="username" value={username} />
        <button style={{ marginLeft: "2%" }} type="submit" className="btn btn-primary">
          ADD
        </button>
      </form>

      <button onClick={() => setPop(true)}>Adicionar</button>
      <Pop_up Setrigger={setPop} trigger={pop}>
        <div style={{ float: "center" }}>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <div className="addtask_div">
              <h5>Add new task:</h5>
              <input type="text" className="form-control-lg" name="newtask" />
              <h5>Descrição</h5>
              <input type="text" name="newdescricao" />
              <input type="date" name="newtime" />
              <input type="hidden" name="newcheck" value={false} />
              <input type="hidden" name="username" value={username} />
              <button style={{ marginLeft: "2%" }} type="submit" className="btn btn-primary">
                ADD
              </button>
            </div>
          </form>
        </div>
      </Pop_up>
    </>
  );
};

const Users = () => {
  return (
    <>
      <div className="container-fluid bg-primary text-purple">
        <div style={{ display: "inline-block", marginLeft: "80%" }}>
          <a href="http://localhost:3000" className="btn btn-danger">Logout</a>
        </div>
        <hr />
      </div>
      <h1><Getusername /></h1>
      <div className="taskdiv">
        <h3 className="tasks"><Callapi1 /></h3>
      </div>
    </>
  );
};

export default Users;
