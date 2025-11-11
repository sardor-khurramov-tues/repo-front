import { Navigate } from "react-router-dom";
import { PATHS } from "@/configs/constants";
import PropTypes from 'prop-types';

export default function ProtectedRouteComp({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  if (roles && !roles.includes(user.userRole)) {
    return <Navigate to={PATHS.HOME} />;
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
