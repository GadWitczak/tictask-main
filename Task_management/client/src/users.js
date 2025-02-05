import react, { useEffect, useState } from 'react';
import React, { ReactDOM } from 'react';
import Loginform from './loginform';
import Createacc from './createacc'
import Tasks from './tasks';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './style.css'
import './bootstrap.css'
import Pop_up from './pop_up';
let count=1;
const Callapi1=(props)=>{
  
    const [tasks,setTask]=useState([])
    const [timestamp, setTimestamp] = useState(Date.now());
      const date =new Date(timestamp)
    const search=useLocation().search;
     global.username=new URLSearchParams(search).get('username')
 
     useEffect(() => {
      fetch("http://localhost:9000/users?username="+global.username) // Substitua pelo username correto
        .then((res) => res.json())
        .then((data) => setTask(data))
        .catch((error) => console.error("Erro ao buscar os dados:", error));
    }, [global.username]);

    
      
    const toggleFeito = async (id, feitoAtual) => {
      try {
          const response = await fetch(`http://localhost:9000/feito/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ feito: !feitoAtual }), // Inverte o valor de feito
          });

          if (!response.ok) {
              throw new Error("Erro ao atualizar tarefa");
          }

          // Atualiza o estado localmente para refletir a mudança
          setTask((prevTasks) =>
              prevTasks.map((task) =>
                  task.id === id ? { ...task, feito: !feitoAtual } : task
              )
          );
      } catch (error) {
          console.error("Erro ao atualizar status:", error);
      }
  };
  const deletarTarefa = async (taskId, username) => {
    try {
        const response = await fetch("http://localhost:9000/deletetask", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: taskId, username }),
        });

        const data = response.headers.get("content-type")?.includes("application/json")
            ? await response.json()
            : { mensagem: "Tarefa deletada, mas sem resposta JSON" };

        console.log(data.mensagem);

        // 🔹 Atualiza a lista removendo a tarefa deletada
        setTask((tarefas) => tarefas.filter((t) => t.id !== taskId));
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
    }
};
      return  (
        <>
     
    <div>
    
    
        <ul>
          {tasks.map((task) => (

            <li key={task.id}>
              <strong>Usuário:</strong> {task.username} <br />
              <strong>Tarefa:</strong> {task.tasks} <br />
              <strong>Criado em:</strong>               {task.descricao}

              {date> new Date(task.tempo)  ?  "acabou o tempo" : "no prazo"}
             {new Date(task.tempo).toLocaleDateString('pt-BR')}
              <button onClick={()=>{toggleFeito(task.id,task.feito)}} >Alternar Feito</button>
              {task.feito ? "Desmarcar" : "Marcar"}
              <button className="btn btn-danger" onClick={() => deletarTarefa(task.id, global.username)}>Delete</button>;

              </li>
          ))}
        </ul>
      
    </div>
     
          </>
     )
    
    }
const Getusername=()=>{
    const search=useLocation().search;
    const [pop,Setpop]=useState(false) 
    var username=new URLSearchParams(search).get('username')
     global.username=username;
   
     return (
      <>

      
        <h1>Ola, {username }</h1>
        <form action='http://localhost:9000/createcategorie' method='POST' className='form-group'>
  <input type='text' className='form-control-lg' name='newcategorie' />
  <input type='hidden' name='username' value={global.username} />

  <button style={{ marginLeft: "2%" }} type='submit' className='btn btn-primary'>
    ADD
  </button>
</form>


        <button  onClick={()=>{Setpop(true)}}>Adicionar</button>
         <Pop_up  Setrigger={Setpop} trigger={pop}>

         <div style={{float:"center"}}>
         <form action='http://localhost:9000/createtask' method="POST" class='form-group'>
          
             <div class='addtask_div'>
               <h5>Add new task:</h5>
              
                      <input type='text' class='form-control-lg' name='newtask'/>
                    <h5>descricao</h5>
               <input type='hidden' name='newcheck' value={false}  />
               <input type='text' name='newdescricao' />
               <input type='date' name='newtime' ></input>

                <input type="hidden" name="username" value={global.username} />
                <button style={{marginLeft:"2%"}} type='submit' class='btn btn-primary'>ADD</button>
            </div>
        </form>

    </div>
         </Pop_up>
 
       </>
     )
}





class Users extends React.Component{
   
    constructor(props){
        super(props);
        
        <>
        <Callapi1/>
        <Getusername/>  
        </>
       
    };
    
    
    render(){
     return <> 

     <div class='container-fluid bg-primary text-purple' >
  
    <div style={{display:"inline-block",marginLeft:"80%"}}>
     <a href='http://localhost:3000' class='btn btn-danger'>Logout</a> </div>
     
     <hr/>
     </div>
     <h1> {<Getusername/>}     </h1>
    
     <div class='taskdiv' >
      <h3 class='tasks' >  <Callapi1/></h3>
    
      </div>
     
      </>
    
    };
    
    
}
export default Users;