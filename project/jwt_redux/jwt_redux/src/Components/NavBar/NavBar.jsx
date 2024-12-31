import { Link } from "react-router-dom";
import "./navbar.css";
import { logout } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import Cookies from 'js-cookie';

const NavBar = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');

  const handleLogout = () => {
    logout(accessToken, dispatch, navigate);
  }

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {user ? (
        <>
          <p className="navbar-user">Hi, <span> {user.userName}  </span> </p>
          <Link to="" className="navbar-logout" onClick={handleLogout}>Log out</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
          <Link to="/register" className="navbar-register"> Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
