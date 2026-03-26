import { BrowserRouter, Routes, Route } from "react-router-dom";
import Predict from "./predict";
import History from "./History";
import Login from "./login";
import Register from "./Register";
import Navbar from "./Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Predict />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;