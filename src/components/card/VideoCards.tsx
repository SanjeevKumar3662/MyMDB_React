import "./VideoCards.css";
import { useState } from "react";
import { useEffect } from "react";

const VideoCards: React.FC<{
  videoId: string;
  title: string;
  type: string;
  mediaId: string | undefined;
}> = ({ videoId, title, type, mediaId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Thumbnail URL from YouTube
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  // console.log(title);

  //video auto play BugFix: if video is playing and without pausing it a
  // new page is opened, then that page's videos will also auto play
  useEffect(() => {
    setIsPlaying(false); // reset video when movie changes
  }, [mediaId]);

  return (
    <>
      {/* <h1>nonono</h1> */}
      <div className="lite-video-wrapper">
        {!isPlaying ? (
          <div className="video-thumbnail" onClick={() => setIsPlaying(true)}>
            {/* Thumbnail Image */}
            <img
              src={thumbnail}
              alt={title}
              className="thumbnail-img"
              loading="lazy"
              // decoding="async"
            />

            {/* Fake Play Button */}
            <div className="play-button">▶</div>
            <p className="video-title">{`${type} : ${title}`}</p>
          </div>
        ) : (
          // Real iframe only when clicked
          <iframe
            className="video-player"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
            title={title}
          ></iframe>
        )}
      </div>
    </>
  );
};

export default VideoCards;
