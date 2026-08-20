import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;
