import heroImage from "/hero.webp";
import "./HomePage.css";
import SlidingCards from "../../components/sliding-cards/SlidingCards";
import SearchInput from "../../components/search-input/SearchInput";
import { useEffect, useState } from "react";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const HomePage: React.FC = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSlow(true);
    }, 2000);

    fetch(`${SERVER_URI}/api/v1/user/ping`)
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setIsSlow(false);
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {isSlow && (
        <div className="bg-gray-800 text-white p-4 text-center my-4 mx-3 rounded-lg shadow-md">
          <strong className="block text-lg">Please wait…</strong>
          <div>Our backend server is waking up from sleep.</div>
          <div>
            Since it’s hosted on Render’s free plan, this may take 20 – 40
            seconds.
          </div>
        </div>
      )}

      <section className="hero">
        <img src={heroImage} alt="" loading="eager" />
        <div className="heroText">
          <span>Welcome.</span>
          <span>This is a Movie Database Website by SanjeevKumar3662</span>
        </div>
        <SearchInput />
      </section>

      <div className="flex-sildes mt-5">
        <section className="slide-container">
          <h2 className="text-2xl">Popular TV Shows</h2>
          <SlidingCards media_type="tv" list_type="popular" />
        </section>
      </div>

      <div className="flex-sildes">
        <section className="slide-container">
          <h2 className="text-2xl">Popular Movies</h2>
          <SlidingCards media_type="movie" list_type="popular" />
        </section>
      </div>
    </main>
  );
};

export default HomePage;
