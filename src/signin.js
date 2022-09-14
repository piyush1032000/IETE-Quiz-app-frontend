import React, {
    useRef,
    useState,
    useEffect
  } from "react";
import axios from 'axios'
import './signin.css'
const Signin = ({setSignedIn,setName,setC,setE}) => {

	const [email,setEmail]=useState("")
	const [password,setPassword]=useState("")

	const sign=(e)=>{
		e.preventDefault()
		//console.log(email,password)
		if(!email)
		{
			alert("Enter Email...")
		}
		else if(!password)
		{
			alert("Enter Password...")
		}
		else
		{
			signIn()
		}
	}


	const signIn=()=>{
		
var data = JSON.stringify({
  "email":email,
  "password": password
});

var config = {
  method: 'post',
  url: 'http://localhost:5000/signin',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  //console.log(JSON.stringify(response.data));
  if(response.data.status)
  {
  setName(response.data.data.name)
  setC(password)
  setE(email)
  setSignedIn(true)
  }
  else{
	alert("Wrong Email or Password...")
  }
  
})
.catch(function (error) {
  console.log(error);
 alert("Some Error Occured")
});

	}

  return (
    <div className='body'>
    <div className="main">  	
		<input type="checkbox" id="chk" aria-hidden="true"/>
			<div className="signup">
				<form>
					<label for="chk" aria-hidden="true">Sign In</label>
					<input type="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
					<input type="password"  placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
					<button onClick={sign}>Sign In</button>
				</form>
			</div>
			<div className="login">
                <p className="logo">© Copyright IETE HIT-SF </p>
			</div>
	</div>
	</div>
  )
}

export default Signin