import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import ChatWidget from './components/ChatWidget';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
          </Routes>
          <ChatWidget />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
