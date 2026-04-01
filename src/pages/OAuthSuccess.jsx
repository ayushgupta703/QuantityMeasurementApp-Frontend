import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      navigate("/");
    } else {
      navigate("/");
    }
  }, []);

  return <p>Logging you in...</p>;
}

export default OAuthSuccess;