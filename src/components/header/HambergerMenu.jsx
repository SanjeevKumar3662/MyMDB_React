import { menuData } from "./menu-data.js";
import { MenuList } from "./MenuList";
import { useAuth } from "../../context/AuthProvider";

// import avatar-png from "/GitHub-logo.png";
import gitLogo from "/GitHub-logo.png";
import { Link } from "react-router-dom";

export const HambergerMenu = ({ isMenuOpen, toggleMenu, closeMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="">
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="menu-list-label">
            <img className="avatar" src={gitLogo} alt="profile" />{" "}
            <span>{user?.username}</span>
          </div>

          {menuData.map((item) => (
            <MenuList
              key={item.label}
              {...item}
              level={1}
              closeMenu={closeMenu}
            />
          ))}

          {isAuthenticated ? (
            <span onClick={() => logout()} className="menu-list-label">
              Logout {user?.username}
            </span>
          ) : (
            <Link onClick={toggleMenu} to={"/auth"}>
              <span className="menu-list-label">Login</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
