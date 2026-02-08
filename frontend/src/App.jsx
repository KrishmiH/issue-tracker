import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IssueDetails from "./pages/IssueDetails";
import NewIssue from "./pages/NewIssue";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/new" element={<Protected><NewIssue /></Protected>} />
          <Route path="/issues/:id" element={<Protected><IssueDetails /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
