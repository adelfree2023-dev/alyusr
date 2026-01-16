import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Inbound from './pages/Inbound';
import Outbound from './pages/Outbound';
import Reports from './pages/Reports';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/inbound" element={
              <ProtectedRoute permission="inbound">
                <Inbound />
              </ProtectedRoute>
            } />

            <Route path="/outbound" element={
              <ProtectedRoute permission="outbound">
                <Outbound />
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute permission="reports">
                <Reports />
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute permission="users">
                <Users />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/reports" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
