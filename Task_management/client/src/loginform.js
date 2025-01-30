<<<<<<< HEAD
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
=======
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
        <><div >
<div class="container-fluid pt-4 bg-primary text-white" style={{marginBottom:-7}}>
        <center>
        <h1  >WELCOME TO TASK MANAGEMENT TOOL</h1><br/>
        
        <h5 >
            The ultimate tool to manage your tasks
           
        </h5><br></br></center>
        </div>
        
        <div class="container-fluid pt-3 bg-info text-white" style={{paddingBottom:100}} ><center>
            <img src={require("./images/index.jpg") }/>
            <form action="http://localhost:9000/login" method="POST" autocomplete="off" style={{display:"inline-block",marginTop:-200}}class="form-group">
Username<br/> <input class="form-control-lg"  onInput={(e)=>{this.state.username=(e.target.value)}} type="text" name="username" /><br/><br/>
Password<br/> <input class="form-control-lg"  onInput={(e)=>{this.state.password=(e.target.value)}} type="password" name="password"/><br/><br/>
<button class="btn btn-primary" type="submit">Login</button>
            </form>
            <p>New user?click  below to create an account</p>
        
           <a href='/createacc' > <button class="btn btn-primary"  >create account</button></a>
           </center>
           <h1>
            {this.state.username}
           </h1></div>
           </div>  </>
    )
}}
>>>>>>> refs/remotes/origin/front_1
export default Loginform;