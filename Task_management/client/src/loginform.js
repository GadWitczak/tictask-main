
import react, { useEffect, useState } from 'react';
import './bootstrap.css';
import './style.css'
import { Outlet,Link } from 'react-router-dom';
import React from 'react';



class Loginform extends React.Component{
   constructor(props){
    super(props);
    this.state={username:"",password:""};
   }
    static getDerivedStateFromProps(props,state){
        if(props.credentials=="invalid"){
            alert("incorrect username/password");
        }
        if(props.credentials=="acccreated"){
            alert("account created successfully");
        }
    }
  
   render(){ return(
        <>
        
        <div class="container-fluid  text-white" style={{}} ><center>
            <div style={{ display:'flex',justifyContent:'center',alignItems:'center'}} >
             <div style={{backgroundColor:'blue',marginRight:0,marginLeft:150}}><img src={require("./images/logo.png") } style={{width:948,height:1080}}/></div>
             <div style={{backgroundColor:'purple', justifyContent:'flex-start',alignItems:'flex-start',marginLeft:250,marginRight:500,marginTop:-200}}>
             <img src={require("./images/login.png")} style={{width:143,height:227,marginTop:-150,marginBottom:100,marginLeft:250}}/>

                <form action="http://localhost:9000/login" method="POST" autocomplete="off"  style={{display:"inline-block",backgroundColor:'gray'}}class="form-group">
<label style={{color:'black',backgroundColor:'yellow',marginRight:385,marginBottom:10}}>Username</label>
 <input class="form-control-lg" style={{width:452,height:44}} placeholder='Nome@gmail.com'  onInput={(e)=>{this.state.username=(e.target.value)}} type="text" name="username" /><br/><br/>
<label style={{backgroundColor:'yellow',color:'black',marginRight:385,marginBottom:10}} >Password</label>
 <input class="form-control-lg"  style={{width:452,height:44}} onInput={(e)=>{this.state.password=(e.target.value)}} type="password" name="password"/><br/><br/>
  <button className="btn btn-primary" type="submit">Login</button>
 
</form>


<a href="/createacc">
  
  <button className="btn btn-primary" style={{marginLeft:190}}>Criar Conta</button>
</a>



            
            
            </div>

            </div>
            
            
        
           </center>
          
           
           </div>
             </>
    )
}}

export default Loginform;