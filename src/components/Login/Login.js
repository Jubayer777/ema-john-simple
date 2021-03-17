
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';

function Login() {
  const [newUser, setNewUser]=useState(false);
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  });
  initializeLoginFramework();
  const [loggedInUser,setLoggedInUser]= useContext(UserContext);
  const history=useHistory();
  const location=useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  
  const googleSignIn=()=>{
    handleGoogleSignIn()
    .then(res=>{
      handleResponse(res,true);
    })
  }

  const fbSignIn=()=>{
    handleFbSignIn()
    .then(res=>{
      handleResponse(res,true);
    })
  }

  const SignOut=()=>{
    handleSignOut()
    .then(res=>{
      handleResponse(res,false);
    })
  }

  const handleResponse=(res,redirect)=>{
      setUser(res);
      setLoggedInUser(res);
      if(redirect){
           history.replace(from);
      }
  }

  const handleSubmit=(event)=>{
    if(newUser && user.email && user.password){
        createUserWithEmailAndPassword(user.name, user.email, user.password)
        .then(res=>{
          handleResponse(res,true);
        })
    }
    if(!newUser && user.email && user.password){
        signInWithEmailAndPassword(user.email, user.password)
        .then(res=>{
          handleResponse(res,true);
        })
    }
    event.preventDefault();
  }
  const handleBlur=(event)=>{
    let isFieldValid=true;
    if(event.target.name==='email'){
         isFieldValid=/\S+@\S+\.\S+/.test(event.target.value);
         
    }
    if(event.target.name==='password'){
        const isPasswordvalid=event.target.value.length > 6;
        const isPassowrdHasNum=/\d{1}/.test(event.target.value);
        isFieldValid =isPasswordvalid && isPassowrdHasNum;
    }
    if(isFieldValid){
          const newUserInfo={...user};
          newUserInfo[event.target.name]=event.target.value;
          setUser(newUserInfo);
    }
  }

  
  return (
    <div style={{textAlign:'center'}}>
        {
          user.isSignedIn ? <button onClick={SignOut}>Sign out</button>:<button onClick={googleSignIn}>Sign in</button>
        }
        <br/>
        <button onClick={fbSignIn}>Sign In with Facebook</button>
        {
          user.isSignedIn && <div>
            <p>Welcome, {user.name}</p>
            <p>Your Email: {user.email}</p>
            <img src={user.photo} alt="not available"/>
          </div>
        }
        <h1>Our own Authentication</h1>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">New user Sign Up</label>
        <form onSubmit={handleSubmit}>
              {
                newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Name"/>
              }
              <br/>
              <input type="text" onBlur={handleBlur} name="email" placeholder="Email" required/>
              <br/>
              <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Password" required/>
              <br/>
              <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
        </form>
        <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>
      }
    </div>
  );
}

export default Login;
