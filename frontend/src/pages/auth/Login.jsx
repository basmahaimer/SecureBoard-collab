import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";  // Changé de "../context/AuthProvider" à "../../context/AuthProvider"
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      loginUser(res.data.token || res.data.access_token);
      const userRes = await api.get("/user");
      const role = userRes.data.roles[0]?.name;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/user");
    } catch (err) {
      console.error(err);
      alert("Erreur login : vérifie email/mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        <Link className="auth-link" to="/register">
          Pas encore inscrit ? Créer un compte
        </Link>
      </div>
    </div>
  );
}