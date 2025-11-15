import { useQuery } from "@tanstack/react-query";
import "./MediaCredits.css";
import Card from "../card/Card";
import "../sliding-cards/SlidingCards.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const MediaCredits: React.FC<{
  media_type: string;
  id: string | undefined;
}> = ({ media_type, id }) => {
  const {
    data: media,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["credits", media_type, id],
    queryFn: fetchCredits,
    enabled: Boolean(id),
  });

  async function fetchCredits() {
    const response = await fetch(
      `${SERVER_URI}/api/v1/media/credits/${media_type}/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch credits");
    }

    const json = await response.json();
    return json.data ?? {}; // <-- VERY important
  }

  if (isError) return <div>Error in loading credits</div>;

  if (isLoading) {
    return (
      <div className="loader-wrap">
        <span className="loader"></span>
      </div>
    );
  }

  if (!media) return null;

  // Safe destructuring (never crashes)
  const cast = media.cast ?? [];

  if (cast.length === 0) return null;

  const settings = {
    dots: false,
    infinite: cast.length > 8,
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 5,
    lazyLoadBuffer: 3,
    responsive: [
      { breakpoint: 1350, settings: { slidesToShow: 6, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 620, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 520, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  return (
    <div className="credits-slider">
      <h1>Credits</h1>

      <Slider {...settings}>
        {cast.map((person: any) => (
          <div key={person.id}>
            <Card
              cssClass="sliding-cards"
              {...person}
              linkTo="person_details"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MediaCredits;
