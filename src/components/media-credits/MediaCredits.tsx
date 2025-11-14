import { useQuery } from "@tanstack/react-query";
import "./MediaCredits.css";
import Card from "../card/Card";
import "../sliding-cards/SlidingCards.css"; // because of lazy loading, styles for slider was imported on refresh

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

const MediaCredits: React.FC<{
  media_type: string;
  id: string | undefined;
}> = ({ media_type, id }) => {
  const {
    data: media,
    isError,
    isPending,
  } = useQuery({
    queryKey: [id, media_type],
    queryFn: fetchDetails,
  });

  async function fetchDetails() {
    try {
      const response = await fetch(
        `https://first-backend-eight.vercel.app/media_credits/${media_type}/${id}`
      );
      return await response.json();
    } catch (error) {
      console.error(
        `error occured while fetching media Credits for ${media_type} ,id: ${id}`,
        "\n",
        error
      );
    }
  }
  if (isError) {
    return <div>Error in {media_type}</div>;
  }

  if (isPending) {
    return (
      <div
        style={{
          // height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="loader"></span>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: media && media.cast.length <= 8 ? false : true,
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 5,
    lazyLoadBuffer: 3,
    responsive: [
      {
        breakpoint: 1350, // tablets
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768, // small tablets / large phones
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 620, // tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 520, // mobile phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  // console.log(media.cast.length);
  if (media.cast.length === 0) return;

  return (
    <>
      <div className="credits-slider">
        <h1>Credits</h1>
        <Slider {...settings}>
          {media &&
            media.cast.map((person: Person) => (
              <div key={person.id}>
                <Card
                  cssClass={"sliding-cards"}
                  {...person}
                  linkTo={"person_details"}
                ></Card>
              </div>
            ))}
        </Slider>
      </div>
    </>
  );
};

export default MediaCredits;
