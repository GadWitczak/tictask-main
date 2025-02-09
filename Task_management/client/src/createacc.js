
import react,{useState} from 'react';
import  ReactDOM  from 'react-dom';
import './bootstrap.css';
import './style.css';
import App from './App'
import Loginform from './loginform';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Outlet,Link } from 'react-router-dom';
import {redirect} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Createacc=()=>{
   
const [username,setusername]=useState("");
const [password,setpassword]=useState("");
const [confirmpassword,setconfirmpassword]=useState("");
const navigate = useNavigate();

    return(
    
<>
         <div style={{ display:'flex',justifyContent:'center',alignItems:'center'}}>

            <div style={{marginLeft:300,marginTop:-200}}>
            <img src={require("./images/cadastro.png")} style={{width:216,height:227,marginLeft:120,marginTop:-10,marginBottom:50}}/>

            <form class="form-group" method='POST' action='http://localhost:9000/createacc'>
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
           <input placeholder='nome@gmail.com' type="text"    style={{
          border: "2px solid grey",
          width: 452,
          height: 44,
          borderRadius: 6,
        }}onInput={(e)=>{setusername(e.target.value)}} class="form-control-lg" name="username" value={username}/><br/><br/>
         
            <label
        style={{
          color: "black",
          marginBottom: 10,
          fontSize: 20,
          fontFamily: "Inter, sans-serif",
          marginRight:'85%'

        }}
      >
        <strong>Senha</strong>
      </label>
             <input type="text" placeholder='**************' style={{
            
          border: "2px solid grey",
          width: 452,
          height: 44,
          borderRadius: 6,
        }} onInput={(e)=>{setpassword(e.target.value)}} class="form-control-lg" name="password" value={password}/><br/><br/>
           
           
           <label
        style={{
          color: "black",
          marginBottom: 10,
          fontSize: 20,
          fontFamily: "Inter, sans-serif",
          marginRight:'85%',
          marginLeft:0

        }}
      >
        <strong>Confirme</strong>
      </label>
            
            
            <input type="text" placeholder='**************'  style={{
            
            
            border: "2px solid grey",
            width: 452,
            height: 44,
            borderRadius: 6,
          }}onInput={(e)=>{setconfirmpassword(e.target.value)}} class="form-control-lg" name="confirmpassword" value={confirmpassword}/> <br/><br/>
     <div style={{ marginTop:10,marginLeft: 50, display: "flex", alignItems: "center" }}>
  <button
    className="btn btn-danger"
    type="submit"
    style={{
      width: 160,
      height: 60,
      fontSize: 20,
      backgroundColor: "#2C4DAB",
      border: "2px solid #2C4DAB",
    }}
  >
    Criar
  </button>

  <button
    onClick={() => navigate("/")}
    style={{
      color: "#2C4DAB",
      width: 160,
      height: 60,
      fontSize: 20,
      backgroundColor: "white",
      marginLeft: 30,
      border: "2px solid #2C4DAB",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    type="button"
  >
    Cancelar
  </button>
</div>

            
           </form>
            </div>
            <div style={{backgroundColor:'blue',marginRight:0,marginLeft:300}}><img src={require("./images/logo.png") } style={{width:948,height:1080}}/></div>
         </div>

         </>
         
    )
}
export default Createacc