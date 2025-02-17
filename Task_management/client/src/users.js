import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pop_up from './pop_up';
import './style.css';
import './bootstrap.css';

const Callapi1 = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("No Prazo");
  const search = useLocation().search;
  const username = new URLSearchParams(search).get('username');

  useEffect(() => {
    fetch(`http://localhost:9000/users?username=${username}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Erro ao buscar os dados:", error));
  }, [username]);

  const toggleFeito = async (id, feitoAtual) => {
    try {
      const response = await fetch(`http://localhost:9000/feito/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feito: !feitoAtual }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tarefa");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, feito: !feitoAtual } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const moverParaLixeira = async (taskId) => {
    try {
      const response = await fetch("http://localhost:9000/trash", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskId, username }),
      });

      if (!response.ok) throw new Error("Erro ao mover tarefa para a lixeira");

      setTasks((tarefas) => tarefas.map((t) => (t.id === taskId ? { ...t, lixo: true } : t)));
    } catch (error) {
      console.error("Erro ao mover para lixeira:", error);
    }
  };

  const excluirPermanentemente = async (taskId) => {
    try {
      const response = await fetch("http://localhost:9000/deletetask", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskId, username }),
      });

      if (!response.ok) throw new Error("Erro ao deletar tarefa");

      setTasks((tarefas) => tarefas.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const filtradas = tasks.filter((task) => {
    const taskDate = new Date(task.tempo);
    if (activeTab === "No Prazo") return new Date() <= taskDate && !task.feito && !task.lixo;
    if (activeTab === "Atrasadas") return new Date() > taskDate && !task.feito && !task.lixo;
    if (activeTab === "Feitas") return task.feito && !task.lixo;
    if (activeTab === "Lixeira") return task.lixo;
    return false;
  });

  return (
    <div className="task-container">
      <div className="tabs" style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        {['No Prazo', 'Atrasadas', 'Feitas', 'Lixeira'].map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
        <ul className="task-list">
            {filtradas.map((task) => {
              const taskDate = new Date(task.tempo);
              return (
                <li key={task.id} className="task-card">
                  <strong>Categoria:</strong> {task.categoria || "Sem categoria"} <br />
                  <strong>Tarefa:</strong> {task.tasks} <br />
                  <strong>Descrição:</strong> {task.descricao} <br />
                  {new Date() > taskDate ? "Acabou o tempo" : "No prazo"} <br />
                  <strong>Data:</strong> {taskDate.toLocaleDateString('pt-BR')} <br />
                  <strong>Hora:</strong> {taskDate.toLocaleTimeString('pt-BR')} <br />
                  <button onClick={() => toggleFeito(task.id, task.feito)}>
                    {task.feito ? "Desmarcar" : "Concluída"}
                  </button>
                  {!task.lixo ? (
                    <button onClick={() => moverParaLixeira(task.id)}>Lixeira</button>
                  ) : (
                    <button onClick={() => excluirPermanentemente(task.id)}>Excluir</button>
                  )}
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
  const [popCategoria, setPopCategoria] = useState(false);
  const [popDeleteCategoria, setPopDeleteCategoria] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const username = new URLSearchParams(search).get('username');

  useEffect(() => {
    fetch(`http://localhost:9000/getcategories?username=${username}`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, [username]);

  const deletarCategoria = async (categoryId) => {
    try {
      const response = await fetch("http://localhost:9000/deletecategory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });

      if (!response.ok) throw new Error("Erro ao deletar categoria");

      // 🔄 Atualiza a lista de categorias após a exclusão
      setCategorias(categorias.filter((categoria) => categoria.id !== categoryId));

      alert("Categoria deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      alert("Erro ao deletar categoria!");
    }
  };
    const handleCreateCategory = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("http://localhost:9000/createcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Categoria criada com sucesso!");
      
      // 🔹 Atualiza categorias sem precisar recarregar a página
      setCategorias([...categorias, { id: categorias.length + 1, nome: data.newcategory }]);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria!");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:9000/getcategories?username=${username}`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, [username]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
        <h1 style={{color:"black"}}>Olá, <strong>{username}</strong></h1>
        <button onClick={() => setPop(true)} className="btn btn-primary">Adicionar Task</button>
        <button onClick={() => setPopCategoria(true)} className="btn btn-secondary">Criar Categoria</button>
        <button onClick={() => setPopDeleteCategoria(true)} className="btn btn-danger">Gerenciar Categorias</button>
      </div>

      {/* Pop-up para adicionar task */}
      <Pop_up Setrigger={setPop} trigger={pop}>
        <div className="addtask-container">
          <h5>Adicionar nova Task:</h5> <br/>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <input type="text" name="newtask" placeholder="Nome da tarefa" required />
            <input type="text" name="newdescricao" placeholder="Descrição da tarefa" required /> <br/>
            <input type="date" name="newtime_date" required /> <br/>
            <input type="time" name="newtime_hour" required /> <br/>
            <h5>Categoria</h5>
            <select name="category" required>
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
            <br/>
            <input type="hidden" name="newcheck" value={false} />
            <input type="hidden" name="username" value={username} />
            <button type="submit">Criar Task</button>
          </form>
        </div>
      </Pop_up>

      {/* Pop-up para criar categoria */}
      <Pop_up Setrigger={setPopCategoria} trigger={popCategoria}>
        <div className="addcategory-container">
          <h5>Adicionar nova Categoria:</h5>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            fetch("http://localhost:9000/createcategory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
              .then((res) => res.json())
              .then(() => {
                setCategorias([...categorias, { id: categorias.length + 1, nome: data.newcategory }]);
                alert("Categoria criada com sucesso!");
              })
              .catch((error) => {
                console.error("Erro ao criar categoria:", error);
                alert("Erro ao criar categoria!");
              });
          }}>
            <input type="text" name="newcategory" placeholder="Nome da categoria" required />
            <input type="hidden" name="username" value={username} />
            <button type="submit">Criar Categoria</button>
          </form>
        </div>
      </Pop_up>

      {/* Pop-up para excluir categorias */}
<Pop_up Setrigger={setPopDeleteCategoria} trigger={popDeleteCategoria}>
  <div className="deletecategory-container" style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", color: "black" }}>
    <h5>Excluir Categorias</h5>
    {categorias.length > 0 ? (
      <ul style={{ listStyle: "none", padding: "0" }}>
        {categorias.map((categoria) => (
          <li key={categoria.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}>
            {categoria.nome}
            <button 
              onClick={() => deletarCategoria(categoria.id)} 
              style={{
                backgroundColor: "#ff4d4d", 
                color: "white", 
                border: "none", 
                padding: "5px 10px", 
                borderRadius: "5px", 
                cursor: "pointer",
                fontWeight: "bold"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#cc0000"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ff4d4d"}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>Nenhuma categoria encontrada.</p>
    )}
  </div>
</Pop_up>

      <Pop_up Setrigger={setPop} trigger={pop}>
        <div className="addtask-container">
          <h5>Adicionar nova Task:</h5> <br/>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <input type="text" name="newtask" placeholder="Nome da tarefa" required />

            <input type="text" name="newdescricao" placeholder="Descrição da tarefa" required /> <br/>
            
            <input type="date" name="newtime_date" required /> <br/>
            
            <input type="time" name="newtime_hour" required /> <br/>

            <h5>Categoria</h5>
            <select name="category" required>
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nome}>{categoria.nome}</option>
              ))}
            </select>
            <br/>
            <input type="hidden" name="newcheck" value={false} />
            <input type="hidden" name="username" value={username} />
            <button type="submit">Criar Task</button>
          </form>
        </div>
      </Pop_up>

      <Pop_up Setrigger={setPopCategoria} trigger={popCategoria}>
        <div className="addcategory-container">
          <h5>Adicionar nova Categoria:</h5>
          <form onSubmit={handleCreateCategory}>
            <input type="text" name="newcategory" placeholder="Nome da categoria" required />
            <input type="hidden" name="username" value={username} />
            <button type="submit">Criar Categoria</button>
          </form>
        </div>
      </Pop_up>
    </>
  );
};

const Users = () => (
  <>
    <div className="container-fluid bg-primary text-purple">
      <a href="http://localhost:3000" className="btn btn-danger">Sair</a>
    </div>
    <Getusername />
    <div className="taskdiv">
      <Callapi1 />
    </div>
  </>
);

export default Users;
