import gitLogo from "/GitHub-logo.png";
import { Link } from "react-router-dom";
import "./Header.css";
import { HambergerMenu } from "./HambergerMenu";

import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleIsMenuOpen = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header-container">
      <div className="left-header">
        <Link to={"/"}>
          <button className="btn">Home</button>
        </Link>

        <a href="https://github.com/SanjeevKumar3662" target="_blank">
          <button className="btn github-btn">
            <img className="git-logo" src={gitLogo} alt="" />

            <span>SanjeevKumar3662</span>
          </button>
        </a>
      </div>

      <div className="mid-header">
        <ul className="media-list-menu ">
          <button className="btn">Movies</button>
          <div className="is-menu-active">
            <div className="media-list-items">
              <Link to={"/movie/now_playing"}>
                <li>Now Playing</li>
              </Link>
              <Link to={"/movie/popular"}>
                <li>Popular</li>
              </Link>
              <Link to={"/movie/top_rated"}>
                <li>Top Rated</li>
              </Link>
              <Link to={"/movie/upcoming"}>
                <li>Upcoming</li>
              </Link>
            </div>
          </div>
        </ul>
        <ul className="media-list-menu ">
          <button className="btn">TV Shows</button>
          <div className="is-menu-active">
            <div className="media-list-items">
              <Link to={"/tv/popular"}>
                <li>Popular</li>
              </Link>
              <Link to={"/tv/airing_today"}>
                <li>Airing Today</li>
              </Link>
              <Link to={"/tv/top_rated"}>
                <li>Top Rated</li>
              </Link>
              <Link to={"/tv/on_the_air"}>
                <li>On The Air</li>
              </Link>
            </div>
          </div>
        </ul>
      </div>

      <div className="right-header">
        <button className="btn " onClick={toggleIsMenuOpen}>
          {user ? `${user?.username} +` : "Menu"}
        </button>
        <HambergerMenu
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleIsMenuOpen}
          closeMenu={closeMenu}
        />
      </div>
    </header>
  );
}
