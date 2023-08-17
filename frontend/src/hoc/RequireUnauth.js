import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const RequireUnauth = ({ children }) => {
    const user = useAuth();
    if (user.isAuth) {
        return <Navigate to='/' />;
    }

    return children;
};

export default RequireUnauth;
