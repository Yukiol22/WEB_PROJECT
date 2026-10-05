import { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (action === "Sign Up" && name.trim() === "") {
            setMessage("Please enter your name.");
            return;
        }

        if (email.trim() === "") {
            setMessage("Please enter your email.");
            return;
        }

        if (password.trim() === "") {
            setMessage("Please enter your password.");
            return;
        }

        setMessage("Please wait...");

        try {
            const endpoint =
                action === "Sign Up"
                    ? "http://localhost:3006/api/auth/register"
                    : "http://localhost:3006/api/auth/login";

            const body =
                action === "Sign Up"
                    ? {
                          name: name.trim(),
                          email: email.trim(),
                          password,
                      }
                    : {
                          email: email.trim(),
                          password,
                      };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || data.error || "Something went wrong."
                );
                return;
            }

            localStorage.setItem("token", data.token);

            if (action === "Sign Up") {
                setMessage("Account created successfully!");
            } else {
                setMessage("Login successful!");
            }

            console.log(data);

        } catch (error) {
            console.error(error);
            setMessage(
                "Could not connect to the server. Make sure the backend is running."
            );
        }
    };

    return (
        <div className="login-signup-container">

            <h1></h1>

            <div className="header-signup">
                <div className="text1">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

                {action === "Login" ? (
                    <div></div>
                ) : (
                    <div className="input">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className="input">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

            </div>

            {message && <p>{message}</p>}

            {action === "Sign Up" ? (
                <div></div>
            ) : (
                <div className="forget-password">
                    Lost Password? <span>Click here!</span>
                </div>
            )}

            <div className="submit-container">

                <div
                    className={action === "Login" ? "submit gray" : "submit"}
                    onClick={() => {
                        if (action === "Sign Up") {
                            handleSubmit();
                        } else {
                            setAction("Sign Up");
                            setMessage("");
                        }
                    }}
                >
                    Sign Up
                </div>

                <div
                    className={action === "Sign Up" ? "submit gray" : "submit"}
                    onClick={() => {
                        if (action === "Login") {
                            handleSubmit();
                        } else {
                            setAction("Login");
                            setMessage("");
                        }
                    }}
                >
                    Login
                </div>

            </div>

        </div>
    );
};

export default LoginSignup;
