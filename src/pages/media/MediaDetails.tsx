// src/pages/media-details/MediaDetails.jsx
import "./MediaDetails.css";
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaCredits from "../../components/media-credits/MediaCredits";
import MediaContentSlider from "../../components/media-content-slider/MediaContentSlider";
import { useQuery } from "@tanstack/react-query";
import AgeWarningPopup from "../../components/age-warning-popup/AgeWarningPopUp";
import countries from "../../data/country-name.js";
import { addToWatchlist, getWatchlist } from "../../utils/watchlist-funcions";
import WatchlistEditModal from "../user-watchlist-page/WatchlistEditModal";

interface Media {
  title: string;
  original_title: string;
  name: string;
  origin_country: string[];
  original_name: string;
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  tagline: string;
  overview: string;
  release_date: string;
  first_air_date: string;
  runtime: number;
  number_of_seasons: number;
  number_of_episodes: string;
  vote_average: number;
  id: number;
  genres: { id: number; name: string }[];
}

interface UpdatedWatchlistEntry {
  message: string;
  entry: {
    _id: string;
    userId: string;
    mediaId: string;
    media: {
      tmdbId: number;
      title: string;
      posterPath: string;
      type: string;
      totalEpisodes: number | null;
    };
    status: string;
    score: number;
    progress: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    notes: string;
  };
}
interface WatchlistEntry {
  _id: string;
  status: string;
  score: number | null;
  progress: number;
  notes?: string;
  media: {
    tmdbId: number;
    title: string;
    posterPath: string;
    type: string;
    totalEpisodes: number | null;
  };
}

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const MediaDetails: React.FC<{ media_type: string }> = ({ media_type }) => {
  const [userConcent, setUserConcent] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { id } = useParams(); // this is TMDB id (string)
  const [watchlistEntry, setWatchlistEntry] = useState<WatchlistEntry | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: media,
    isPending,
    isError,
    isSuccess,
  } = useQuery<Media>({
    queryKey: ["media-details", media_type, id],
    queryFn: fetchDetails,
  });

  async function fetchDetails() {
    try {
      const response = await fetch(
        `${SERVER_URI}/api/v1/media/details/${media_type}/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.error(
        `error occured while fetching media details for ${media_type},id:${id}`,
        error
      );
    }
  }

  // find watchlist entry for this media by scanning all tabs
  async function findEntryForMedia() {
    if (!media) return;
    const tabs = [
      "watching",
      "completed",
      "on_hold",
      "dropped",
      "plan_to_watch",
    ];
    for (const tab of tabs) {
      try {
        const data = await getWatchlist(tab);

        if (!data?.items) continue;

        const match = data.items.find(
          (item: { media: { tmdbId: any; type: string } }) =>
            Number(item.media?.tmdbId) === Number(media.id) &&
            item.media?.type === media_type
        );

        if (match) {
          setWatchlistEntry(match);
          // setStatus()
          return;
        }
      } catch (err) {
        console.warn("watchlist load error", err);
      }
    }
    setWatchlistEntry(null);
  }

  // re-run when media loads
  useEffect(() => {
    findEntryForMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  if (isPending) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return <div>Error in media details page</div>;
  }

  isSuccess && window.scrollTo(0, 0); //scrolls to top
  if (!media) return null;

  if (media.adult === true && userConcent === null) {
    return <AgeWarningPopup setConcent={setUserConcent} />;
  }
  if (userConcent === false) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "1.5rem",
          padding: "20px",
        }}
      >
        ❌ Sorry, you are not old enough for this content. you can still browse
        other content
      </div>
    );
  }

  return (
    <>
      <div className="details-container">
        {media.backdrop_path && (
          <img
            className="details-bg"
            src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
            alt="backdrop image"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        )}
        <section className="poster-details">
          {media.poster_path ? (
            <img
              className="poster"
              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
              srcSet={`https://image.tmdb.org/t/p/w342${media.poster_path} 1x,
            https://image.tmdb.org/t/p/w500${media.poster_path} 2x`}
              alt="poster"
              loading="eager"
            />
          ) : (
            <img src="/noImage.png" loading="lazy" decoding="async" />
          )}
        </section>
        <section className="more-info">
          <span className="media-page-heading">
            {media.title ? media.title : media.name}
          </span>
          {(media.original_title || media.original_name) && (
            <div>
              Original Title : {media.original_title || media.original_name}
            </div>
          )}
          <div>
            Origin Countries : {""}
            {media.origin_country &&
              media.origin_country.map((ele: string, index: number) => {
                const country_name =
                  countries.get(ele)?.english_name ?? "Unknown";
                return <span key={index}>{`${country_name}`} , </span>;
              })}
          </div>
          {media.tagline && <div>Tagline : {media.tagline}</div>}
          <div className="title">
            Discription :<span> {media.overview}</span>
          </div>
          {media.release_date ? (
            <div className="release-date">
              Release Date : {media.release_date}
            </div>
          ) : (
            <div className="release-date">
              First Air Date : {media.first_air_date}
            </div>
          )}
          {media.runtime && <div>Runtime : {media.runtime} minutes</div>}

          {media.number_of_seasons && (
            <div>Number of Seasons : {media.number_of_seasons}</div>
          )}
          {media.number_of_episodes && (
            <div>Number of Episodes : {media.number_of_episodes}</div>
          )}
          {media.vote_average && (
            <div className="user-score">User Score : {media.vote_average}</div>
          )}

          <div>
            Genres :{" "}
            {media.genres &&
              media.genres.map((ele) => (
                <span key={ele.id}>{ele.name} , </span>
              ))}
          </div>

          {/* Button: Add OR status + open modal */}
          {!watchlistEntry ? (
            <button
              onClick={async () => {
                await addToWatchlist(media.id, media_type);
                // refresh local entry detection
                findEntryForMedia();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add to Watchlist
            </button>
          ) : (
            <div className="flex justify-center gap-2 mt-4 capitalize">
              <span className="px-4 py-2 text-white rounded btn">
                {watchlistEntry?.status?.replaceAll("_", " ") ?? "In list"}
              </span>

              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-2 bg-gray-700 text-white rounded"
              >
                Edit
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="video-container">
        <MediaContentSlider
          media_type={media_type}
          content_type={"videos"}
          id={id}
        />
      </div>
      <div className="backdrops-container">
        <MediaContentSlider
          media_type={media_type}
          content_type={"images"}
          id={id}
        />
      </div>

      <p className="section-heading">Credits</p>
      <section className="credits-container slider-bg">
        <MediaCredits media_type={media_type} id={id} />
      </section>

      <div className="rec-slider">
        <p className="section-heading">Recommendations</p>
        <MediaContentSlider
          media_type={media_type}
          content_type={"recommendations"}
          id={id}
        />
      </div>

      {/* Watchlist Edit Modal */}
      <WatchlistEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={watchlistEntry}
        onSaved={(updated: UpdatedWatchlistEntry) => {
          // if updated === null -> deleted
          if (!updated) {
            setWatchlistEntry(null);
          } else {
            setWatchlistEntry({ ...watchlistEntry, ...updated.entry });
          }
        }}
      />
    </>
  );
};

export default MediaDetails;
