
import react, { useEffect, useState } from 'react';
import './bootstrap.css';
import './style.css'
import { Outlet,Link } from 'react-router-dom';
import React from 'react';
import "@fontsource/inter"; 


class Loginform extends React.Component{
   constructor(props){
    super(props);
    this.state={username:"",password:""};
   }
    static getDerivedStateFromProps(props,state){
        if(props.credentials==="invalid"){
            alert("incorrect username/password");
        }
        if(props.credentials==="acccreated"){
            alert("account created successfully");
        }
    }
  
   render(){ return(
        <>
        
        <div class="container-fluid  text-white" style={{}} ><center>
            <div style={{ display:'flex',justifyContent:'center',alignItems:'center'}} >
             <div style={{backgroundColor:'blue',marginRight:0,marginLeft:150}}><img src={require("./images/logo.png") } style={{width:948,height:1080}}/></div>
             <div style={{justifyContent:'flex-start',alignItems:'flex-start',marginLeft:250,marginRight:500,marginTop:-200}}>
             <img src={require("./images/login.png")} style={{width:143,height:227,marginTop:-10,marginBottom:50}}/>

             <form
      action="http://localhost:9000/login"
      method="POST"
      autoComplete="off"
      style={{
        fontFamily: "Inter, sans-serif",
        display: "inline-block",
      }}
      className="form-group"
    >
      {/* E-mail */}
      <label
        style={{
          color: "black",
          marginBottom: 10,
          fontSize: 20,
          fontFamily: "Inter, sans-serif",
          marginRight:'85%'

        }}
      >
        <strong>E-mail</strong>
      </label>
      <input
        className="form-control-lg"
        style={{
          border: "2px solid grey",
          width: 452,
          height: 44,
          borderRadius: 6,
        }}
        placeholder="Nome@gmail.com"
        type="text"
        name="username"
      />
      <br />
      <br />

      {/* Password */}
      <label
        style={{

          color: "black",
          marginBottom: 10,
          fontSize:20,
          display: "block",
          fontFamily:'Inter,san-serif',
          marginRight:'100%'
          
        }}
      >
        <strong>Senha</strong>
        
      </label>
      <input
        className="form-control-lg"
        style={{
          border: "2px solid grey",
          width: 452,
          height: 44,
          borderRadius:6
        }}
        placeholder='********'
        type="password"
        name="password"
      />
      <br />
      <br />

      {/* Botões alinhados lado a lado */}
      <div style={{ display: "flex", gap: "24px",marginLeft:60,marginTop:50}}>
        <button className="btn btn-primary"  style={{ width:160,height:60,fontSize:20,backgroundColor:'#2C4DAB'}}type="submit">
          Login
        </button>
        <a href="/createacc">
          <button style={{color:'#2C4DAB',width:160,height:60,fontSize:20,backgroundColor:'white',border:'2px solid #2C4DAB',fontFamily:'Inter,sans-serif'}} type="button">
            Criar Conta
          </button>
        </a>
      </div>
    </form>
  
            
            
            </div>

            </div>
            
            
        
           </center>
          
           
           </div>
             </>
    )
}}

export default Loginform;