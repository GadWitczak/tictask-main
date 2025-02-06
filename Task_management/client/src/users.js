import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pop_up from './pop_up';
import './style.css';
import './bootstrap.css';

const Callapi1 = () => {
  const [tasks, setTask] = useState([]);
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
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          padding: 0,
          listStyle: 'none',
          justifyContent: 'center',
        }}
      >
        {tasks.map((task) => {
          const taskDate = new Date(task.tempo);
          return (
            <li
              key={task.id}
              style={{
                backgroundColor: '#2d3748',
                color: 'white',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '250px',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              <strong>Usuário:</strong> {task.username} <br />
              <strong>Tarefa:</strong> {task.tasks} <br />
              <strong>Descrição:</strong> {task.descricao} <br />
              {new Date() > taskDate ? "Acabou o tempo" : "No prazo"} <br />
              <strong>Data:</strong> {taskDate.toLocaleDateString('pt-BR')} <br />
              <strong>Hora:</strong> {taskDate.toLocaleTimeString('pt-BR')} <br />
              <button
                onClick={() => toggleFeito(task.id, task.feito)}
                style={{
                  backgroundColor: task.feito ? '#801010' : '#108010',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
              >
                {task.feito ? "Desmarcar" : "Concluída"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deletarTarefa(task.id)}
                style={{
                  marginTop: '10px',
                }}
              >
                Excluir
              </button>
            </li>
          );
        })}
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
        <h1><span style={{ color: "black" }}>Olá, <strong>{username}</strong></span></h1>
        <button onClick={() => setPop(true)} className="btn btn-primary">Adicionar Task</button>
      </div>


      <Pop_up Setrigger={setPop} trigger={pop}>
        <div className="addtask-container">
          <h5>Adicionar nova Task:</h5>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <input type="text" className="form-control-lg" name="newtask" placeholder="Nome da tarefa" required />
            
            <h5>Descrição</h5>
            <input type="text" name="newdescricao" placeholder="Descrição da tarefa" required />

            <h5>Data de vencimento</h5>
            <input type="date" name="newtime_date" required />
            
            <h5>Horário de vencimento</h5>
            <input type="time" name="newtime_hour" required />

            <input type="hidden" name="newcheck" value={false} />
            <input type="hidden" name="username" value={username} />

            <button type="submit" className="btn btn-success" style={{ marginTop: "10px" }}>
              Criar Task
            </button>
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
          <a href="http://localhost:3000" className="btn btn-danger">Sair</a>
        </div>
        <hr />
      </div>
      <Getusername />
      <div className="taskdiv">
        <Callapi1 />
      </div>
    </>
  );
};

export default Users;
