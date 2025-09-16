// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsList from './pages/ProjectsList';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';


export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route element={<DashboardLayout/>}>
          <Route path="/" element={<ProjectsList/>}/>
          <Route path="/projects" element={<ProjectsList/>}/>
        </Route>
      </Route>
      <Route path="/403" element={<Forbidden/>}/>
    </Routes>
  );
}
