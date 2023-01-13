import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../../globalUrl";
import { useHistory } from 'react-router-dom'
import Loader from "../../components/Loader/Loader";
const Login = ({setIsLogin}) => {
  const [userName, setUserName] = useState()
  const [password, setPassword] = useState()
  const [loader, setLoader] = useState(false)
  const history = useHistory()
  const handleLogin = (e) => {
    e.preventDefault()
    setLoader(true)
    if (!userName || !password) {
      toast.error("Please fill all the fields!", { position: "bottom-right" })
      setLoader(false)
      return
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": userName,
      "password": password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${URL}/api/auth/login/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result)
        if (result.message !== undefined) {
          toast.error(result.message,{ position: "bottom-right" })
          setLoader(false)
        }
        else {
          setTimeout(() => {
            history.push('/categories')
          }, 1000)
          localStorage.setItem('user', JSON.stringify(result))
          
          toast.success("Login successfully!", { position: "bottom-right" })
          setTimeout(() => {
            setIsLogin(true)
          }, 1000)
          
          // setLoader(false)
        }
      })
      .catch(error => {
        // console.log('error', error)
        toast.error(error, { position: "bottom-right" })
      });
  }
  return (
    <>
      {!loader?
         <div className="login-form-container">
         <form className="login-form">
           <div className="login-form-content">
             <h3 className="login-form-title text-success">Login Now!</h3>
             <div className="form-group  mt-3">
               <label className="text-success">Email address</label>
               <input
                 type="email"
                 className="form-control mt-1"
                 placeholder="Enter email"
                 onChange={(e) => setUserName(e.target.value)}
               />
             </div>
             <div className="form-group mt-3">
               <label className="text-success">Password</label>
               <input
                 type="password"
                 className="form-control mt-1"
                 placeholder="Enter password"
                 onChange={(e) => setPassword(e.target.value)}
               />
             </div>
             <div className="d-grid gap-2 mt-3">
               <button type="submit" className="btn btn-success" onClick={handleLogin}>
                 Submit
               </button>
             </div>
             <p className="forgot-password text-center mt-3">
               Not a member <Link to={"/signup"} className={"text-success"}>Register Now!</Link>
             </p>
           </div>
         </form>
       </div>
        :
        <Loader/>
      }
     
      <ToastContainer />
    </>

  );
}

export default Login;
