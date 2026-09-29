import { useState } from "react";
import "./LoginSignup.css";


const LoginSignup = () => {
    const handleSubmit = () => {
        console.log(name, "name");
        console.log(email, "email");
        console.log(password, "password");

    }
    const [action, setAction] = useState ("Login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


  return (

    <div className="login-signup-container">
        <h1></h1>
        <div className="header-signup">
            <div className="text1">{action}</div>
            <div className="underline"></div>
        </div>

              <div className="inputs">

            {action==="Login" ? <div></div>: <div className="input">


                <input type="text" placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                 />


            </div>}


             <div className="input">

                <input type="email" placeholder="Email" 

                value={email}
                onChange={(e) => setEmail(e.target.value)}

                
                />
            </div>

             <div className="input">
                
                <input type="password" placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                />
            </div>

        </div>
        {action==="Sign Up"?
        <div></div>:
         <div className="forget-password">
            Lost Password? <span>Click here!</span>
            
            </div>}
        <div className="submit-container">
            <div className={action==="Login"?"submit gray ":"submit" }
             onClick={()=>{setAction("Sign Up");
                handleSubmit();

             }}>

                 Sign Up</div>
            <div className={action==="Sign Up"?"submit gray ":"submit"}
             onClick={()=>{setAction("Login");
                handleSubmit();

             }}>Login</div>

        </div>
    </div>
  );
};

export default LoginSignup;

