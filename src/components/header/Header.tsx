import gitLogo from "/GitHub-logo.png";
import { Link } from "react-router-dom";
import "./Header.css";

import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // console.log("user in header:", user);

  // if (loading) {
  //   return <div>loading</div>;
  // }
  // console.log(isAuthenticated, user);
  return (
    <header className="header-container">
      <button
        className="btn hambergar-menu"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        =
      </button>
      <div className="left-header">
        {isMenuOpen && (
          <div className="mobile-menu">
            <h3>Movies</h3>
            <ul>
              <li>
                <Link to="/movie/now_playing">Now Playing</Link>
              </li>
              <li>
                <Link to="/movie/popular">Popular</Link>
              </li>
              <li>
                <Link to="/movie/top_rated">Top Rated</Link>
              </li>
              <li>
                <Link to="/movie/upcoming">Upcoming</Link>
              </li>
            </ul>

            <h3>TV Shows</h3>
            <ul>
              <li>
                <Link to="/tv/popular">Popular</Link>
              </li>
              <li>
                <Link to="/tv/airing_today">Airing Today</Link>
              </li>
              <li>
                <Link to="/tv/top_rated">Top Rated</Link>
              </li>
              <li>
                <Link to="/tv/on_the_air">On The Air</Link>
              </li>
            </ul>
          </div>
        )}

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
        {isAuthenticated ? (
          <button onClick={() => logout()} className="btn">
            Logout {user?.username}
          </button>
        ) : (
          <Link to={"/auth"}>
            <button className="btn">Login</button>
          </Link>
        )}
      </div>
    </header>
  );
}
