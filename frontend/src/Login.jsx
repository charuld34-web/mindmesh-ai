import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // YE POORA LOGIC AAPKA PURANA WALA HI HAI (NO CHANGES)
  const handleSubmit = async () => {
    if (!username || !password) {
      return alert("All fields are required");
    }

    try {
      if (isSignUp) {
        const res = await axios.post(" https://mindmesh-ai-mkvw.onrender.com/api/auth/signup", {
          username: username,
          password: password
        });
        alert(res.data.message);
        setIsSignUp(false);
        setPassword("");
      } else {
        const res = await axios.post(" https://mindmesh-ai-mkvw.onrender.com/api/auth/login", {
          username: username,
          password: password
        });
        if (res.data.success) {
          localStorage.setItem("loggedIn", "true");
          setIsLoggedIn(true);
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error Details: " + err.message);
      }
    }
  };

  // Modern UI Styles
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",
    background: "#f9f9f9"
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5", // Light neutral background
      fontFamily: "sans-serif"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          width: "350px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>
          {isSignUp ? "Create Account" : "MindMesh AI Login"}
        </h2>
        <p style={{ fontSize: "13px", color: "#777", marginBottom: "20px" }}>
          {isSignUp ? "Join the AI network" : "Secure System Access"}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "login"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "25px",
            background: isSignUp ? "#4caf50" : "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </motion.button>

        <p 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setUsername("");
            setPassword("");
          }}
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#2196f3",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500"
          }}
        >
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </motion.div>
    </div>
  );
}

export default Login;