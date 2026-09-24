import { useState } from "react";
import "./LoginSignup.css";


const LoginSignup = () => {
    const [action, setAction] = useState ("Login")
  return (

    <div className="login-signup-container">
        <h1></h1>
        <div className="header-signup">
            <div className="text1">{action}</div>
            <div className="underline"></div>
        </div>

              <div className="inputs">

            {action=="Login" ? <div></div>: <div className="input">
               

                <input type="text" placeholder="Name" />


            </div>}


             <div className="input">

                <input type="email" placeholder="Email" />
            </div>

             <div className="input">
                
                <input type="password" placeholder="Password" />
            </div>
        </div>
        {action==="Sign up"?<div></div>: <div className="forget-password">Lost Password? <span>Click here!</span></div>}
        <div className="submit-container">
            <div className={action==="Login"?"submit gray ":"submit" } onClick={()=>{setAction("Sign Up")}}> Sign Up</div>
            <div className={action==="Sign Up"?"submit gray ":"submit"} onClick={()=>{setAction("Login")}}>Login</div>

        </div>
    </div>
  );
};

export default LoginSignup;

