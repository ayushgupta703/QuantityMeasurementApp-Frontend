import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { registerUser } from "../services/authService";
import { useToast } from "../components/ToastManager";

function Signup() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // handle signup (same flow as UC19)
  const handleSignup = async (e) => {
    e.preventDefault();
  
    // ✅ ADD THIS
    if (!form.name || !form.email || !form.password) {
      showToast("Please fill all fields", "error");
      return;
    }
  
    try {
      await registerUser(form);
  
      showToast("Signup successful!", "success");
      navigate("/");
  
    } catch (err) {
      showToast(err.message || "Signup failed", "error");
    }
  };

  return (
    <div className="auth-wrapper">
      <ThemeToggle detached={true} />

      {/* LEFT PANEL */}
      <div className="auth-left-panel">
        <div className="logo-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="M7 21h10"/>
            <path d="M12 3v18"/>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
          </svg>
        </div>
        <h2>Quantity<br />Measurement App</h2>
      </div>

      {/* RIGHT CARD */}
      <div className="auth-card">

        {/* Tabs */}
        <div className="tabs">
          <Link to="/">LOGIN</Link>
          <span className="active">SIGNUP</span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignup}>

          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Email Id</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              👁
            </span>
          </div>

          <button className="primary-btn">SIGNUP</button>
        </form>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Google Button (UI only for now) */}
        <button
          className="google-btn"
          onClick={() => {
            window.location.href = "http://localhost:8082/auth-service/oauth2/authorization/google";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}

export default Signup;