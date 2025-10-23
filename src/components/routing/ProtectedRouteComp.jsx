import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function ProtectedRouteComp({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

ProtectedRouteComp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node), 
    PropTypes.node,
  ]).isRequired, 
  
  roles: PropTypes.arrayOf(PropTypes.string),
};
