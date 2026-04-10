import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Predict from "./Predict";
import History from "./History";
import Login from "./login";
import Register from "./Register";
import Navbar from "./Navbar";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/predict" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/predict" element={
              <ProtectedRoute>
                <Predict />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;