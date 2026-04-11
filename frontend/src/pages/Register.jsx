import React, { useState } from "react";
import API from "../services/api";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleRegister = async () => {
    await API.post("/auth/register", data);
    alert("Registered successfully");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setData({ ...data, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setData({ ...data, password: e.target.value })} />
      <input placeholder="Phone" onChange={(e) => setData({ ...data, phone: e.target.value })} />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;