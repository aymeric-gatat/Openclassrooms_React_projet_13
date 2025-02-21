import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logout } from "../features/Login/authSlice";
import BankLogo from "../assets/img/argentBankLogo.png";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser(token));
    }
  }, [token, dispatch, user]);

  useEffect(() => {
    if (user) {
      setFirstName(user.body.firstName);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout()); // Réinitialise le state Redux
    navigate("/sign-in"); // Redirige vers la page de connexion après déconnexion
  };

  return (
    <nav className="main-nav">
      <Link to={"/"} className="main-nav-logo">
        <img className="main-nav-logo-image" src={BankLogo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        {token ? (
          <div>
            <Link className="main-nav-item" href="./user.html">
              <i className="fa fa-user-circle"></i>
              {!user ? "" : firstName}
            </Link>
            <button className="main-nav-item" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i>
              Sign Out
            </button>
          </div>
        ) : (
          <Link className="main-nav-item" to="/sign-in">
            <i className="fa fa-user-circle"></i>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
