import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (role && user.roles?.some(r => r.name === role) === false) {
    return <Navigate to="/login" />; // ou page 403 si tu veux
  }

  return children;
};

export default PrivateRoute;
