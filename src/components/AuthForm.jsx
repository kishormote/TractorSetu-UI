import { useState } from "react";

const AuthForm = ({ title, onSubmit }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{title}</h2>
      {title === "Signup" && (
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      )}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">{title}</button>
    </form>
  );
};

export default AuthForm;