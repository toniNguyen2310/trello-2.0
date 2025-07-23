import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '@contexts/AuthContext'
import LoadingComponent from "@components/LoadingComponent/LoadingComponent ";

const ProtectedRoute = () => {
    const { user } = useAuth();

    const isLoggedIn = user && user._id;

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
