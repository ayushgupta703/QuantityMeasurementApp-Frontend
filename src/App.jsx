import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthSuccess from "./pages/OAuthSuccess";
import { ToastProvider } from "./components/ToastManager";
import GlobalHeaderPill from "./components/GlobalHeaderPill";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <GlobalHeaderPill />

        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;