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
  
    const [task,setTask]=useState("")
    const [createdAt, setCreatedAt] = useState();

    const search=useLocation().search;
     global.username=new URLSearchParams(search).get('username')
 
     fetch("http://localhost:9000/users?username="+global.username)
     .then(res=>res.text())
     .then(res=>setTask(res))
     .then(res=>setCreatedAt(res))
     

      return task.length ? (
        <>

         <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      padding: "16px"
    }}>
      {task.split('\n').map((str, index) => (
        <div key={index} style={{
          padding: "16px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff"
        }}>
          <span style={{
            backgroundColor: task.color,
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold"
          }}>{str.created_at}</span>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "8px" }}>{str}</h2>
          <p style={{ color: "#555", fontSize: "14px" }}>📅 33</p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
            Precisa entregar a documentação projeto, diagramas (caso de uso), protótipos de baixa e média, oferendas.
          </p>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <button style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
              ✔ Marcar como concluída
            </button>
          
             
              <form action="http://localhost:9000/deletetask" method='post'><button  class='btn btn-danger'  type='submit'>Delete</button><input type='hidden' name='task' value={str}></input><input type='hidden' name='username' value={global.username}></input></form>
          </div>
        </div>
      ))}
    </div>
        
          </>
     ):''
    
}
const Getusername=()=>{
    const search=useLocation().search;
    const [pop,Setpop]=useState(false) 
    var username=new URLSearchParams(search).get('username')
     global.username=username;
     const tasks = [
      { category: "Faculdade", title: "Eng. Software - Checkpoint 1", date: "14/01/2025", color: "purple" },
      { category: "Casa", title: "Comprar Botijão de Gás", date: "14/01/2025", color: "orange" },
      { category: "Trabalho", title: "Proposta Cliente 198", date: "14/01/2025", color: "green" },
      { category: "Igreja", title: "Grupo de Oração hoje 23:59", date: "14/01/2025", color: "red" }
    ];
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
    
     <div class='taskdiv' style={{backgroundColor:"black"}}>
      <h3 class='tasks' >  <Callapi1/></h3>
    
      </div>
     
      </>
    
    };
    
    
}
export default Users;