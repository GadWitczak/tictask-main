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
    const search=useLocation().search;
     global.username=new URLSearchParams(search).get('username')
    
     fetch("http://localhost:9000/users?username="+global.username)
     .then(res=>res.text())
     .then(res=>setTask((res)))
     const length=task.length;
     var text1;
if(length!=0){
     text1=task.split('\n').map(str=><p>{str}  <div style={{display:"inline-block"}}><form action="http://localhost:9000/deletetask" method='post'><button  class='btn btn-danger'  type='submit'>Delete</button><input type='hidden' name='task' value={str}></input><input type='hidden' name='username' value={global.username}></input></form></div> </p>)
}
else{
  text1="NO TASKS AVAILABLE"
}
     return(
        <>
        
            {text1}
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
         <Pop_up trigger={pop}>

         <div style={{float:"center"}}>
      <form action='http://localhost:9000/createtask' method="POST" class='form-group'>
      <br/>
      <div class='addtask_div'>
        <h5>Add new task:</h5><input type='text' class='form-control-lg' name='newtask'/>
    
      
    
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
    <Pop_up></Pop_up>
    
     <div class='taskdiv'>
      <h3 class='tasks' ><Callapi1/></h3>
    
      </div>
     
      </>
    
    };
    
    
}
export default Users;