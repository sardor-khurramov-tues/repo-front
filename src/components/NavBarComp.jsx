import { Link, useNavigate } from "react-router-dom";
import { signout } from "../services/api/AuthService";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector";
import { PATHS, USER_ROLES } from "../configs/constants";

export default function NavBarComp() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = async () => {
    await signout();
    localStorage.removeItem("user");
    navigate(PATHS.HOME);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <Link
        to={PATHS.HOME}
        className="text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors duration-200"
      >
        {t('nav.home')}
      </Link>

      <div className="flex items-center space-x-4">
        <LanguageSelector />

        {user ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <AuthLinks />
        )}
      </div>
    </nav>
  );
}

function DashboardLink({ role }) {
  const { t } = useTranslation();
  let to = PATHS.AUTHOR;

  if (role === USER_ROLES.ADMIN) to = PATHS.ADMIN;
  else if (role === USER_ROLES.STAFF) to = PATHS.STAFF;

  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors duration-200"
    >
      {t('nav.dashboard')}
    </Link>
  );
}

DashboardLink.propTypes = {
  role: PropTypes.string.isRequired,
};

function UserMenu({ user, onLogout }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-4">
      <DashboardLink role={user.userRole} />
      <Link
        to={PATHS.USER}
        className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors duration-200"
      >
        {t('nav.profile')}
      </Link>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded transition-colors duration-200"
      >
        {t('nav.logout')}
      </button>
    </div>
  );
}

UserMenu.propTypes = {
  user: PropTypes.shape({
    userRole: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

function AuthLinks() {
  const { t } = useTranslation();
  return (
    <>
      <Link
        to={PATHS.REGISTER_AUTHOR}
        className="text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 font-medium px-3 py-2 rounded-lg transition-all duration-200"
      >
        {t('nav.register')}
      </Link>
      <Link
        to={PATHS.LOGIN}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200"
      >
        {t('nav.login')}
      </Link>
    </>
  );
}
