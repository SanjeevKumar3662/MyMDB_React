import { Analytics } from "@vercel/analytics/react"; //vercel analytics
import { SpeedInsights } from "@vercel/speed-insights/react"; //vercel SpeedInsights

import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { AuthProvider } from "./context/AuthProvider";
import { Suspense } from "react";

import "./App.css";

const Header = lazy(() => import("./components/header/Header"));
const MediaLists = lazy(() => import("./pages/media/MediaLists"));
const MovieDetails = lazy(() => import("./pages/media/MediaDetails"));
const HomePage = lazy(() => import("./pages/home-page/HomePage"));
const PersonPage = lazy(() => import("./pages/person-page/PersonPage"));
const ShutDown = lazy(() => import("./pages/home-page/ShutDown"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthLayout"));
const UserWatchlistPage = lazy(() =>
  import("./pages/user-watchlist-page/UserWatchlistPage")
);

function App() {
  const isSiteDown = false;

  return (
    <>
      {/* if details then no header */}
      <AuthProvider>
        <Suspense
          fallback={
            <div
              className="btn"
              style={{ padding: "1rem", textAlign: "center" }}
            >
              <strong>Please wait...</strong>
              <br />
              Our backend server is waking up from sleep.
              <br />
              Since it’s hosted on Render’s free plan, this can take 20–40
              seconds.
            </div>
          }
        >
          {<Header></Header>}

          <Routes>
            <Route
              path="/"
              element={isSiteDown ? <ShutDown /> : <HomePage />}
            />

            <Route
              path="/movie/now_playing"
              element={
                <MediaLists
                  media_type={"movie"}
                  list_type={"now_playing"}
                  headerText={"Now Playing Movies"}
                />
              }
            />
            <Route
              path="/movie/popular"
              element={
                <MediaLists
                  media_type={"movie"}
                  list_type={"popular"}
                  headerText={"Popular Movies"}
                />
              }
            />
            <Route
              path="/movie/top_rated"
              element={
                <MediaLists
                  media_type={"movie"}
                  list_type={"top_rated"}
                  headerText={"Top Rated Movies"}
                />
              }
            />
            <Route
              path="/movie/upcoming"
              element={
                <MediaLists
                  media_type={"movie"}
                  list_type={"upcoming"}
                  headerText={"Upcomming Movies"}
                />
              }
            />

            <Route
              path="/tv/airing_today"
              element={
                <MediaLists
                  media_type={"tv"}
                  list_type={"airing_today"}
                  headerText={"Airing Today - TV"}
                />
              }
            />
            <Route
              path="/tv/on_the_air"
              element={
                <MediaLists
                  media_type={"tv"}
                  list_type={"on_the_air"}
                  headerText={"On The Air - TV"}
                />
              }
            />
            <Route
              path="/tv/popular"
              element={
                <MediaLists
                  media_type={"tv"}
                  list_type={"popular"}
                  headerText={"Popular - TV"}
                />
              }
            />
            <Route
              path="/tv/top_rated"
              element={
                <MediaLists
                  media_type={"tv"}
                  list_type={"top_rated"}
                  headerText={"Top Rated - TV"}
                />
              }
            />

            <Route
              path="/movie_details/:id"
              element={<MovieDetails media_type={"movie"} />}
            />
            <Route
              path="/tv_details/:id"
              element={<MovieDetails media_type={"tv"} />}
            />

            <Route path="/person_details/:page?/:id" element={<PersonPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/list/:status" element={<UserWatchlistPage />} />

            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
