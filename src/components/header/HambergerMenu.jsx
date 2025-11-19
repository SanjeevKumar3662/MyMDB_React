import { menuData } from "./menu-data.js";
import { MenuList } from "./MenuList";
import { useAuth } from "../../context/AuthProvider";

import gitLogo from "/GitHub-logo.png";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export const HambergerMenu = ({
  isMenuOpen,
  toggleMenu,
  closeMenu,
  buttonRef,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!isMenuOpen) return;

      // Ignore clicks on the toggle button
      if (buttonRef?.current && buttonRef.current.contains(e.target)) {
        return;
      }

      // Close if click outside the menu
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu, buttonRef]);

  return (
    <div>
      {isMenuOpen && (
        <div ref={menuRef} className="mobile-menu">
          {isAuthenticated && (
            <>
              <div className="menu-list-label">
                <img className="avatar" src={gitLogo} alt="profile" />
                <span>{user?.username}</span>
              </div>
              <Link to={"/list/watching"}>
                <div className="menu-list-label">
                  <span> My Watchlist</span>
                </div>
              </Link>
            </>
          )}

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
