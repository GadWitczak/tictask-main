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

    const search=useLocation().search;
     global.username=new URLSearchParams(search).get('username')
 
     useEffect(() => {
      fetch("http://localhost:9000/users?username="+global.username) // Substitua pelo username correto
        .then((res) => res.json())
        .then((data) => setTask(data))
        .catch((error) => console.error("Erro ao buscar os dados:", error));
    }, [global.username]);
      
    const toggleFeito = (id, feitoAtual) => {
      const novoFeito = !feitoAtual; // Inverte o estado atual de 'feito'
  
      console.log(`Enviando atualização para ID: ${id}, Novo Feito: ${novoFeito}`);
  
      fetch(`http://localhost:9000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feito: novoFeito }), // Envia o novo estado
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta do servidor:", data);
  
          if (!data || data.error) {
            throw new Error(data.error || "Erro ao atualizar a tarefa");
          }
  
          // Atualiza o estado no front-end para refletir a mudança
          setTask((tasks) =>
            tasks.map((task) =>
              task.id === id ? { ...task, feito: novoFeito } : task
            )
          );
        })
        .catch((error) => console.error("Erro no PUT:", error));
    };
  
    
      return  (
        <>
     
    <div>
    
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>Usuário:</strong> {task.username} <br />
              <strong>Tarefa:</strong> {task.tasks} <br />
              <strong>Criado em:</strong> {task.created_at}
              {task.descricao}
              <br></br>
              <button onClick={()=>{toggleFeito(task.id,task.feito)}} >Alternar Feito</button>
              {task.feito ? "Desmarcar" : "Marcar"}
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
        <button  onClick={()=>{Setpop(true)}}>Adicionar</button>
         <Pop_up  Setrigger={Setpop} trigger={pop}>

         <div style={{float:"center"}}>
         <form action='http://localhost:9000/createtask' method="POST" class='form-group'>
           <br/>
             <div class='addtask_div'>
               <h5>Add new task:</h5>
              
                      <input type='text' class='form-control-lg' name='newtask'/>
                    <h5>descricao</h5>
               <input type='hidden' name='newcheck' value={false}  />
               <input type='text' name='newdescricao' />

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