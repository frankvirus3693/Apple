import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  localStorage.setItem("isLoggedIn", "false");
  const navigate = useNavigate(); // ใช้ useNavigate ในการเปลี่ยนเส้นทาง
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ตรวจสอบว่า username และ password ถูกต้อง
    if (username === "admin" && password === "1234") {
      // บันทึกข้อมูลใน Local Storage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      // เปลี่ยนเส้นทางไปยังหน้า Adminpage
      navigate("/Adminpage"); // เปลี่ยนเส้นทางตาม path ของคุณ
    } else {
      // alert("Invalid credentials");
      navigate("/login");
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/Adminpage");
    } else {
      // navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-gray-500 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
