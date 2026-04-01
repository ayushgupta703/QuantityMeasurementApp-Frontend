import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";
import { loginUser, registerUser } from "../services/authService";
import { useToast } from "../components/ToastManager";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const [isLogin, setIsLogin] = useState(location.pathname === "/");
  
  useEffect(() => {
    setIsLogin(location.pathname === "/");
  }, [location.pathname]);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitch = (loginMode) => {
    if (isLogin === loginMode) return;
    setIsLogin(loginMode);
    setForm({ name: "", email: "", password: "" });
    navigate(loginMode ? "/" : "/signup", { replace: true });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      localStorage.setItem("token", res.token);
      showToast("Login successful! Welcome back.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Login failed. Check your credentials.", "error");
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.email || !form.password) {
        showToast("Please fill in all fields.", "error");
        return;
      }
      await registerUser(form);
      showToast("Account created! Please log in.", "success");
      handleSwitch(true);
    } catch (err) {
      showToast(err.message || "Signup failed. Try again.", "error");
    }
  };

  const googleBtn = (
    <button
      className="google-btn"
      onClick={() => window.location.href = "http://localhost:8081/oauth2/authorization/google"}
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );

  return (
    <div className="auth-wrapper">

      {/* LEFT PANEL */}
      <div className="auth-left-panel">
        <div className="vertical-watermark">QUANTITY</div>
        <div className="ambient-particles">
           {[...Array(10)].map((_, i) => <span key={i} className="particle"></span>)}
        </div>
        
        <div className="isometric-cluster">
           <svg className="iso-flask" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>
           </svg>
           <svg className="iso-ruler" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 16.5 16.5 21 3 7.5 7.5 3 21 16.5Z"/><path d="m14 10.5 4-4"/><path d="m10 14.5 4-4"/><path d="m6 18.5 4-4"/>
           </svg>
           <svg className="iso-scale" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
           </svg>
        </div>
        
        <h2 style={{position: "relative", zIndex: 2}}>Quantity<br />Measurement App</h2>
        
        <div className="feature-list">
          <div className="feature-item">
            <span className="glow-star">✦</span> Real-time Conversions
          </div>
          <div className="feature-item">
            <span className="glow-star">✦</span> Four Measurement Types
          </div>
          <div className="feature-item">
            <span className="glow-star">✦</span> Compare & Calculate Arithmetic
          </div>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="auth-card">
        {/* Tabs */}
        <div className="tabs">
          <span className={isLogin ? "active" : ""} onClick={() => handleSwitch(true)}>LOGIN</span>
          <span className={!isLogin ? "active" : ""} onClick={() => handleSwitch(false)}>SIGNUP</span>
          <div className={`tab-indicator ${!isLogin ? "right" : ""}`}></div>
        </div>

        {/* Carousel Transition View */}
        <div className="form-carousel">
          <div className="form-wrapper" style={{ transform: isLogin ? "translateX(0%)" : "translateX(-50%)" }}>
            
            {/* LOGIN PANE */}
            <div className="form-pane">
              <form onSubmit={handleSubmitLogin}>
                <label>Email Id</label>
                <input type="email" name="email" value={isLogin ? form.email : ""} onChange={handleChange} />

                <label>Password</label>
                <div className="password-field">
                  <input type={showPassword ? "text" : "password"} name="password" value={isLogin ? form.password : ""} onChange={handleChange} />
                  <span onClick={() => setShowPassword(!showPassword)}>👁</span>
                </div>

                <button className="primary-btn">LOGIN</button>
              </form>
              <div className="divider">OR</div>
              {googleBtn}
            </div>

            {/* SIGNUP PANE */}
            <div className="form-pane">
              <form onSubmit={handleSubmitSignup}>
                <label>Full Name</label>
                <input name="name" value={!isLogin ? form.name : ""} onChange={handleChange} />

                <label>Email Id</label>
                <input type="email" name="email" value={!isLogin ? form.email : ""} onChange={handleChange} />

                <label>Password</label>
                <div className="password-field">
                  <input type={showPassword ? "text" : "password"} name="password" value={!isLogin ? form.password : ""} onChange={handleChange} />
                  <span onClick={() => setShowPassword(!showPassword)}>👁</span>
                </div>

                <button className="primary-btn">SIGNUP</button>
              </form>
              <div className="divider">OR</div>
              {googleBtn}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
