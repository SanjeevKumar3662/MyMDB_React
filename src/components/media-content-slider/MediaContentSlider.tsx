import "./MediaContentSlider.css";
import VideoCards from "../card/VideoCards";
import Slider from "react-slick";
import Card from "../card/Card";
import { useQuery } from "@tanstack/react-query";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const MediaContentSlider: React.FC<{
  media_type: string;
  id: string | undefined;
  content_type: string;
}> = ({ media_type, id, content_type }) => {
  const {
    data: contentData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [media_type, id, content_type],
    queryFn: fetchContentData,
    enabled: Boolean(id),
  });

  async function fetchContentData() {
    const response = await fetch(
      `${SERVER_URI}/api/v1/media/content/${media_type}/${id}/${content_type}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch media content");
    }

    const json = await response.json();
    return json.data ?? {};
  }

  if (isError) return <div>Error loading media content.</div>;

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  }

  if (!contentData) return null;

  const images = contentData.backdrops ?? [];
  const results = contentData.results ?? [];

  // If nothing available
  if (
    (content_type === "images" && images.length === 0) ||
    (content_type !== "images" && results.length === 0)
  ) {
    return null;
  }

  const getSlidesToShow = (type: string, bp: number | string = "desktop") => {
    switch (bp) {
      case "desktop":
        return type === "videos" ? 2 : type === "images" ? 3 : 8;
      case 1200:
        return type === "videos" ? 1 : type === "images" ? 2 : 4;
      case 520:
        return type === "videos" ? 1 : type === "images" ? 1 : 1;
      default:
        return 3;
    }
  };

  // Now create settings FIRST
  const settings: any = {
    // dots: false,
    // infinite: movies && movies?.length <= 8 ? false : true,
    // speed: 3000,
    arrows: content_type === "videos",
    autoplay: content_type !== "videos",
    autoplaySpeed: 3000,
    centerMode: content_type !== "videos",
    // pauseOnHover: true,
    dots: false,
    infinite: true,
    pauseOnFocus: true,
    slidesToShow: getSlidesToShow(content_type, "desktop"),
    slidesToScroll: content_type === "recommendations" ? 1 : 1,
    lazyLoad: "ondemand",
    lazyLoadBuffer: 3,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: getSlidesToShow(content_type, 1200),
          slidesToScroll: content_type === "recommendations" ? 1 : 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: getSlidesToShow(content_type, 520),
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Disable infinite AFTER settings exist
  if (content_type === "images" && images.length <= 1)
    settings.infinite = false;
  if (content_type === "videos" && results.length <= 1)
    settings.infinite = false;

  return (
    <div className="slider-bg" style={{ padding: "10px" }}>
      <Slider {...settings}>
        {content_type === "videos" &&
          results.map((video: any) => (
            <VideoCards
              key={video.id ?? video.key}
              type={video.type}
              title={video.name}
              videoId={video.key}
              mediaId={id}
            />
          ))}

        {content_type === "images" &&
          images.map((img: any, i: number) => (
            <div className="backdrop-border" key={i}>
              <img
                className="backdrops"
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                alt=""
              />
            </div>
          ))}

        {content_type === "recommendations" &&
          results.map((media: any) => (
            <Card
              key={media.id}
              cssClass="sliding-cards"
              {...media}
              linkTo={`${media_type}_details`}
            />
          ))}
      </Slider>
    </div>
  );
};

export default MediaContentSlider;
