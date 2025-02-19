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



  return (
   <div>

<div  style={{display:'grid', gridTemplateColumns:'repeat(2,0.40fr)',gap:'1px',justifyContent:'center',marginTop:50}}className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

    
    {tasks.map((task) => {
      const taskDate = new Date(task.tempo);
      return (
        
        <div key={task.id} style={{backgroundColor:'#CFE2FF',alignContent:'center',height:280,borderRadius:16}} className="task-card">
          <div> <h1 style={{marginLeft:50,marginTop:20,color:'black'}}>{task.tasks}</h1></div>
          <div> <p style={{width:600,marginLeft:50,marginTop:20,color:"#68717A"}}>  {task.descricao} </p></div>
          
         
          <div style={{marginTop:50,marginLeft:50,color:"black"}}>

          {new Date() > taskDate ? "Acabou o tempo" : "No prazo"}: 
            {taskDate.toLocaleDateString('pt-BR')}-{taskDate.toLocaleTimeString('pt-BR')} <br />

          </div>
          <div>
       <div style={{display:'flex',justifyContent:'space-around'}}>
       
     <h6  style={{backgroundColor:"#9747FF",width:150,borderRadius:12,paddingLeft:25,height:30,paddingTop:5,marginTop:20}}>        {task.nome_categoria || "Sem categoria"}
     </h6>
        

       <div style={{display:'flex',justifyContent:'space-around'}}>

<div > <button
  onClick={() => toggleFeito(task.id, task.feito)}
  style={{
    backgroundColor: task.feito ? "gray" : "green",
    color: task.feito ? "white" : "white",
    borderRadius: "5px",
  }}
>
  {task.feito ? "Desmarcar" : "Concluída"}
</button>
</div>
<div style={{marginLeft:10}}> <button style={{backgroundColor:"yellow",color:"black"
}}>Editar</button></div>
<div style={{marginLeft:10}}>  <button style={{backgroundColor:"red",color:"white"}} onClick={() => excluirPermanentemente(task.id)}>Excluir</button></div>


   

    

</div>
       </div>
       
          
          </div>
         
          
      </div>


    );
  })}

  
  </div>
    
 

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
      setCategorias([...categorias, { id: categorias.length , nome: data.newcategory }]);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria!");
    }
  };

 

  return (
    <>
    
   
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: "20px" }}>

        <div style={{backgroundColor:"",marginTop:-100}}>
        <h1 style={{color:"black",fontSize:40}}>Olá, <strong>{username}</strong></h1>


        </div>
       <div style={{backgroundColor:"",justifyContent:"space-between",display:"flex",gap:50}}> 

        <div>
        <button onClick={() => setPop(true)} style={{width:196,height:60,color:'white',borderRadius:6,backgroundColor:"#5227CC"}} > <strong>+ Criar Nova tarefa</strong></button>


        </div>
        <div>

        <button onClick={() => setPopCategoria(true)}  style={{width:196,height:60,color:'#5227CC'}} ><strong>+ Criar Nova Categoria</strong></button>

        </div>
        <div>
        <button onClick={() => setPopDeleteCategoria(true)} style={{width:196,height:60,color:'#5227CC',border:"2px solid #5227CC",backgroundColor:'white'}}> Gerenciar Categorias</button>

        </div>

       </div>

      
      </div>

      {/* Pop-up para adicionar task */}
      <Pop_up Setrigger={setPop} trigger={pop}>
       <div className="addtask-container">
          <h5 style={{color:'black'}}>Adicionar nova Task:</h5> <br/>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <input type="text" name="newtask" placeholder="Nome da tarefa" required />
            <textarea name="newdescricao" placeholder="Descrição da tarefa" required></textarea>
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
          <h5 style={{color:"black"}}>Adicionar nova Categoria:</h5>
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
    { categorias.map((cat)=>(<div style={{color:"black",borderRadius:"black",justifyContent:"center"}}>
      <div style={{marginTop:"20"}}>
       {cat.nome}
       <button style={{marginLeft:40,backgroundColor:"red",color:"white"}} onClick={()=>{deletarCategoria(cat.id)}}>Excluir</button>
      </div>
     
    </div>))}
  </div>
</Pop_up>

      <Pop_up Setrigger={setPop} trigger={pop}>
        <div className="addtask-container">
          <h5 style={{color:'black'}}>Adicionar nova Task:</h5> <br/>
          <form action="http://localhost:9000/createtask" method="POST" className="form-group">
            <input  type="text" name="newtask" placeholder="Nome da tarefa" required />
          

          <div style={{display:'flex',gap:10,marginTop:15}}>

          <input type="date" name="newtime_date" required /> <br/>
            
            <input type="time" name="newtime_hour" required /> <br/>


          </div>
            
          
            <textarea style={{marginTop:10,width:340,height:100,marginTop:15}} name="newdescricao" placeholder="Descrição da tarefa" required></textarea>

            <select  style={{marginTop:15}} name="category" >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
            <br/>
            <input type="hidden" name="newcheck" value={false} />
            <input type="hidden" name="username" value={username} />
            <button style={{marginTop:15,alignContent:'center',backgroundColor:"#2C4DAB",color:"white",padding:10}} type="submit">Criar Task</button>
          </form>
        </div>
      </Pop_up>

      <Pop_up Setrigger={setPopCategoria} trigger={popCategoria}>
        <div className="addcategory-container">
          <h5 style={{color:"black"}}>Adicionar nova Categoria:</h5>
          <form onSubmit={handleCreateCategory}>
            <input type="text" name="newcategory" placeholder="Nome da categoria" required />
            <input type="hidden" name="username" value={username} />
            <button  style={{marginTop:20,backgroundColor:"#2C4DAB",color:"white",padding:10}}type="submit">Criar Categoria</button>
          </form>
        </div>
      </Pop_up>
    </>
  );
};

const Users = () => (
  <>
    <div style={{backgroundColor:'CFE2FF', height:60}}>
      <a href="http://localhost:3000" className="btn btn-danger">Sair</a>
    </div>

    <div style={{marginTop:150,justifyContent:"space-around"}}>

    <div style={{}}>
    <Getusername />

    </div>

    <div style={{}} className="taskdiv">
  <Callapi1 />
</div>
    <div >



</div>



    </div>
    
  </>
);

export default Users;
