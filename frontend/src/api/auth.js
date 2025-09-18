import api from "./axios";

// Register
export const register = async (name, email, password) => {
  try {
    const res = await api.post("/register", { name, email, password, password_confirmation: password });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Login
export const login = async (email, password) => {
  try {
    const res = await api.post("/login", { email, password });
    // On sauvegarde le token
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
};
