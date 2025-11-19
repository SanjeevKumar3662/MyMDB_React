import { menuData } from "./menu-data.js";
import { MenuList } from "./MenuList";
import { useAuth } from "../../context/AuthProvider";

import gitLogo from "/GitHub-logo.png";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export const HambergerMenu = ({ isMenuOpen, toggleMenu, closeMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const menuRef = useRef(null);

  useEffect(() => {
    //close the menu if the user's click is outside the menu
    function handleClickOutside(e) {
      // If menu is not open, do nothing
      if (!isMenuOpen) return;

      // If click is OUTSIDE menu, close it
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  return (
    <div>
      {isMenuOpen && (
        <div ref={menuRef} className="mobile-menu">
          <div className="menu-list-label">
            <img className="avatar" src={gitLogo} alt="profile" />
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
