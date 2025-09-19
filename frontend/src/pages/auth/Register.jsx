import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";  // Changé de "../context/AuthProvider" à "../../context/AuthProvider"
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";


export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      loginUser(res.data.token || res.data.access_token);
      const userRes = await api.get("/user");
      const role = userRes.data.roles[0]?.name;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/user");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                Inscription...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>
        <Link className="auth-link" to="/login">
          Déjà inscrit ? Se connecter
        </Link>
      </div>
    </div>
  );
}