import "./LoginSignup.css";


const LoginSignup = () => {
  return (

    <div className="login-signup-container">
        <h1></h1>
        <div className="header-signup">
            <div className="text1">Sign up</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src="" alt="" />
                <input type="text" />
            </div>

             <div className="input">
                <img src="" alt="" />
                <input type="email" />
            </div>

             <div className="input">
                <img src="" alt="" />
                <input type="password" />
            </div>
        </div>
        <div className="forget-password">Lost Password? <span>Click here!</span></div>
        <div className="submit-container">
            <div className="submit">Sign Up</div>
            <div className="submit">Login</div>

        </div>
    </div>
  );
};

export default LoginSignup;

